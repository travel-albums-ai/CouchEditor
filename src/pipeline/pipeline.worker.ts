// Pipeline evaluation engine, running on a dedicated worker so heavy
// per-pixel processing never blocks the main thread.
//
// Compared to the old main-thread engine:
// - Images travel between stages as ImageBitmaps, so intermediate stages
//   no longer pay a canvas.toDataURL base64 encode + <img> decode round
//   trip per image per stage. Only the final viewer output is encoded.
// - Per-image work (load / transform / encode / AI upload) is bounded so
//   large batches don't exhaust memory.
// - Every new evaluation cooperatively cancels the previous one: stale
//   checks run between images and in-flight fetches are aborted.

import { lutStage, parseCubeLut } from "@/lib/lut";
import {
  blackAndWhiteStage,
  brightnessStage,
  contrastStage,
  detectFilmBaseColor,
  exposureStage,
  fadeStage,
  filmBaseRemoverStage,
  gammaStage,
  grainStage,
  hdrEffectStage,
  highlightsStage,
  hueRotationStage,
  invertStage,
  luminosityStage,
  popStage,
  rgbBlackPointStage,
  rgbMidtonesStage,
  rgbWhitePointStage,
  saturationStage,
  sepiaStage,
  shadowsStage,
  sharpenStage,
  splitToningStage,
  temperatureTintStage,
  vibranceStage,
  vignetteStage,
  whitesBlacksStage,
} from "@/lib/utils";
import type {
  NodeInputs,
  NodeOutputs,
  PipelineEvaluateMessage,
  PipelineNodeDefinition,
  PipelineProgressPreview,
  PipelineViewerImagePayload,
  PipelineWorkerOutbound,
  Stage,
} from "@/types/types";
import { VIEWER_NODE_TYPES } from "@/types/types";
import { parse } from "exifr";
import {
  gpuFragmentShader,
  gpuOperationIds,
  gpuVertexShader,
  type GpuOperation,
} from "./gpuShader";

// ============================================================
// Worker scope
// ============================================================

// The app compiles against the DOM lib (where `self` is Window), so the
// worker's global scope is described structurally here instead.
type WorkerScope = {
  postMessage: (message: PipelineWorkerOutbound) => void;
  onmessage: ((event: MessageEvent<PipelineEvaluateMessage>) => void) | null;
};

const workerScope = self as unknown as WorkerScope;


// ============================================================
// In-worker image representation
// ============================================================

// Inside the worker, images are ImageBitmaps: cheap GPU-side handles
// that can be drawn straight onto an OffscreenCanvas.
type WorkerImage = {
  bitmap: ImageBitmap;
  width: number;
  height: number;
  name?: string;
  exif?: Record<string, unknown>;
  exifSegment?: Uint8Array;
  // Stable identity (thumbnail URL / file fingerprint) used as the
  // AI node result-cache key.
  cacheKey?: string;
};

const DEFAULT_PHASE_CACHE_BYTES = 384 * 1024 * 1024;
const DEFAULT_AI_CACHE_BYTES = 128 * 1024 * 1024;
const aiImageCaches = new Set<Map<string, WorkerImage>>();
const retiredBitmaps = new Set<ImageBitmap>();

function getImageSetKey(image: WorkerImage): string | ImageBitmap {
  return image.cacheKey ?? image.name ?? image.bitmap;
}

// Bounds in-flight image work inside an individual node. The worker-wide
// task queue below limits how many pipeline nodes can run at once.
const DEFAULT_IMAGE_CONCURRENCY = Math.max(
  2,
  Math.min(4, navigator.hardwareConcurrency ?? 4)
);
let imageConcurrencyLimit = DEFAULT_IMAGE_CONCURRENCY;
let phaseCacheLimitBytes = DEFAULT_PHASE_CACHE_BYTES;
let aiCacheLimitBytes = DEFAULT_AI_CACHE_BYTES;
let viewerMaxDimension = 1600;
let progressPreviewMaxDimension = 480;
let progressPreviewQuality = 0.84;

class PipelineTaskQueue {
  private active = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(private readonly limit: number) {}

  async run<T>(evaluationId: number, task: () => Promise<T>): Promise<T> {
    throwIfStale(evaluationId);

    if (this.active >= this.limit) {
      await new Promise<void>((resolve) => this.waiters.push(resolve));
      throwIfStale(evaluationId);
    }

    this.active += 1;

    try {
      return await task();
    } finally {
      this.active -= 1;
      this.waiters.shift()?.();
    }
  }
}

class AIRequestQueue {
  private active = 0;
  private nextStartAt = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(
    private readonly limit: number,
    private readonly delayMs: number
  ) {}

  async run<T>(evaluationId: number, task: () => Promise<T>): Promise<T> {
    throwIfStale(evaluationId);

    if (this.active >= this.limit) {
      await new Promise<void>((resolve) => this.waiters.push(resolve));
      throwIfStale(evaluationId);
    }

    this.active += 1;

    try {
      const now = Date.now();
      const startAt = Math.max(now, this.nextStartAt);
      this.nextStartAt = startAt + this.delayMs;

      if (startAt > now) {
        await new Promise<void>((resolve) => setTimeout(resolve, startAt - now));
        throwIfStale(evaluationId);
      }

      return await task();
    } finally {
      this.active -= 1;
      this.waiters.shift()?.();
    }
  }
}

// ============================================================
// Cooperative cancellation
// ============================================================

class StaleEvaluationError extends Error {
  constructor() {
    super("Pipeline evaluation superseded");
  }
}

let latestEvaluationId = 0;
let activeController: AbortController | null = null;

function throwIfStale(evaluationId: number) {
  if (evaluationId !== latestEvaluationId) {
    throw new StaleEvaluationError();
  }
}

// Promise.all over items with bounded concurrency and a staleness
// check before each item starts.
async function mapWithConcurrency<T, R>(
  items: T[],
  evaluationId: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  const lanes = Array.from(
    { length: Math.min(imageConcurrencyLimit, items.length) },
    async () => {
      while (nextIndex < items.length) {
        throwIfStale(evaluationId);
        const index = nextIndex++;
        results[index] = await fn(items[index]);
      }
    }
  );

  await Promise.all(lanes);

  return results;
}

const BATCH_INPUT_KEYS = ["image", "image-1", "image-2", "image-3", "image-4"];
const FILE_SOURCE_NODE_TYPES = new Set([
  "source",
  "hot-folder-read",
  "webcam",
  "screen-share",
  "google-drive",
]);

function getBatchInputKeys(nodeType: string | undefined, inputs: NodeInputs): string[] {
  if (nodeType === "pdf-source") {
    return ["pdfPages"];
  }

  if (FILE_SOURCE_NODE_TYPES.has(nodeType ?? "")) {
    return ["files"];
  }

  if (nodeType === "selection") {
    return ["photos"];
  }

  if (nodeType === "collage") {
    return [];
  }

  if (nodeType === "image-picker") {
    return [];
  }

  return BATCH_INPUT_KEYS.filter((key) => Array.isArray(inputs[key]));
}

async function executeInPhotoBatches(
  definition: PipelineNodeDefinition,
  nodeType: string | undefined,
  inputs: NodeInputs,
  evaluationId: number,
  batchSize: number,
  taskQueue: PipelineTaskQueue
): Promise<NodeOutputs> {
  const batchKeys = getBatchInputKeys(nodeType, inputs);

  if (batchKeys.length === 0) {
    return taskQueue.run(evaluationId, () => definition.execute(inputs));
  }

  const normalizedBatchInputs = batchKeys.map((key) => [
    key,
    Array.isArray(inputs[key]) ? inputs[key] as unknown[] : [],
  ] as const);
  const batchLength = Math.max(
    ...normalizedBatchInputs.map(([, value]) => value.length)
  );
  const merged: NodeOutputs = {};

  for (let start = 0; start < batchLength; start += batchSize) {
    throwIfStale(evaluationId);

    const batchInputs = { ...inputs };
    for (const [key, value] of normalizedBatchInputs) {
      batchInputs[key] = value.slice(start, start + batchSize);
    }
    if (nodeType === "source") {
      batchInputs.sourceProgressOffset = start;
    }

    const result = await taskQueue.run(
      evaluationId,
      () => definition.execute(batchInputs)
    );

    for (const [key, value] of Object.entries(result)) {
      if (Array.isArray(value)) {
        const existing = Array.isArray(merged[key]) ? merged[key] as unknown[] : [];
        merged[key] = [...existing, ...value];
      } else {
        merged[key] = value;
      }
    }
  }

  return merged;
}

// ============================================================
// Image loading / rendering primitives (OffscreenCanvas-based)
// ============================================================

async function blobToWorkerImage(
  blob: Blob,
  name?: string,
  cacheKey?: string,
  exif?: Record<string, unknown>
): Promise<WorkerImage> {
  const bitmap = await createImageBitmap(blob);
  const exifSegment = await extractExifSegment(blob);

  return {
    bitmap,
    width: bitmap.width,
    height: bitmap.height,
    name,
    cacheKey,
    exif,
    exifSegment,
  };
}

async function extractExifSegment(blob: Blob): Promise<Uint8Array | undefined> {
  const bytes = new Uint8Array(await blob.arrayBuffer());

  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return undefined;

  let offset = 2;

  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) break;

    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }

    const segmentLength = (bytes[offset + 2] << 8) | bytes[offset + 3];
    const segmentEnd = offset + 2 + segmentLength;

    if (segmentEnd > bytes.length) break;

    if (
      marker === 0xe1 &&
      segmentLength >= 8 &&
      bytes[offset + 4] === 0x45 &&
      bytes[offset + 5] === 0x78 &&
      bytes[offset + 6] === 0x69 &&
      bytes[offset + 7] === 0x66 &&
      bytes[offset + 8] === 0x00 &&
      bytes[offset + 9] === 0x00
    ) {
      return bytes.slice(offset, segmentEnd);
    }

    offset = segmentEnd;
  }

  return undefined;
}

async function addExifSegment(blob: Blob, exifSegment: Uint8Array | undefined): Promise<Blob> {
  if (!exifSegment) return blob;

  const bytes = new Uint8Array(await blob.arrayBuffer());

  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return blob;

  return new Blob([
    bytes.slice(0, 2),
    exifSegment,
    bytes.slice(2),
  ], { type: "image/jpeg" });
}

async function loadFileImage(file: File): Promise<WorkerImage> {
  const image = await blobToWorkerImage(
    file,
    file.name,
    `file:${file.name}:${file.size}:${file.lastModified}`
  );

  try {
    image.exif = await parse(file);
  } catch {
    // Some image formats do not contain parseable EXIF data.
  }

  return image;
}

async function loadUrlImage(
  url: string,
  name: string | undefined,
  signal: AbortSignal
): Promise<WorkerImage> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Failed to load image from ${url} (${response.status})`);
  }

  const blob = await response.blob();
  const image = await blobToWorkerImage(blob, name, url);

  try {
    image.exif = await parse(blob);
  } catch {
    // Some image formats do not contain parseable EXIF data.
  }

  return image;
}

function createCanvas(
  width: number,
  height: number
): [OffscreenCanvas, OffscreenCanvasRenderingContext2D] {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  return [canvas, ctx];
}

const IMAGE_TILE_SIZE = 1024;
const NON_TILE_SAFE_GPU_OPERATIONS = new Set<GpuOperation["kind"]>([
  "vignette",
  "sharpen",
  "hdr",
]);

type GpuRenderer = {
  canvas: OffscreenCanvas;
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  positionBuffer: WebGLBuffer;
  texture: WebGLTexture;
  positionLocation: number;
  texCoordLocation: number;
  operationLocation: WebGLUniformLocation;
  paramsLocation: WebGLUniformLocation;
  resolutionLocation: WebGLUniformLocation;
  textureWidth: number;
  textureHeight: number;
};

let gpuRenderer: GpuRenderer | null | undefined;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create GPU shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(log);
  }

  return shader;
}

function getGpuRenderer(): GpuRenderer | null {
  if (gpuRenderer !== undefined) return gpuRenderer;

  try {
    const canvas = new OffscreenCanvas(1, 1);
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
    if (!gl) {
      gpuRenderer = null;
      return gpuRenderer;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, gpuVertexShader);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, gpuFragmentShader);
    const program = gl.createProgram();
    if (!program) throw new Error("Could not create GPU program");

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? "Could not link GPU program");
    }

    const positionBuffer = gl.createBuffer();
    const texture = gl.createTexture();
    const operationLocation = gl.getUniformLocation(program, "uOperation");
    const paramsLocation = gl.getUniformLocation(program, "uParams");
    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    if (!positionBuffer || !texture || !operationLocation || !paramsLocation || !resolutionLocation) {
      throw new Error("Could not initialize GPU resources");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 0, 0,
        1, -1, 1, 0,
        -1, 1, 0, 1,
        1, 1, 1, 1,
      ]),
      gl.STATIC_DRAW
    );
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gpuRenderer = {
      canvas,
      gl,
      program,
      positionBuffer,
      texture,
      positionLocation: gl.getAttribLocation(program, "aPosition"),
      texCoordLocation: gl.getAttribLocation(program, "aTexCoord"),
      operationLocation,
      paramsLocation,
      resolutionLocation,
      textureWidth: 0,
      textureHeight: 0,
    };
  } catch {
    gpuRenderer = null;
  }

  return gpuRenderer;
}

function renderGpuImage(source: WorkerImage, operation: GpuOperation): WorkerImage | null {
  const renderer = getGpuRenderer();
  if (!renderer) return null;

  const { canvas, gl } = renderer;
  canvas.width = source.width;
  canvas.height = source.height;
  gl.viewport(0, 0, source.width, source.height);
  gl.useProgram(renderer.program);
  gl.bindBuffer(gl.ARRAY_BUFFER, renderer.positionBuffer);
  gl.enableVertexAttribArray(renderer.positionLocation);
  gl.vertexAttribPointer(renderer.positionLocation, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(renderer.texCoordLocation);
  gl.vertexAttribPointer(renderer.texCoordLocation, 2, gl.FLOAT, false, 16, 8);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, renderer.texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source.bitmap);
  renderer.textureWidth = source.width;
  renderer.textureHeight = source.height;
  gl.uniform1i(renderer.operationLocation, gpuOperationIds[operation.kind]);
  gl.uniform1fv(renderer.paramsLocation, new Float32Array(operation.params ?? []));
  gl.uniform2f(renderer.resolutionLocation, source.width, source.height);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  if (gl.getError() !== gl.NO_ERROR) return null;

  return {
    bitmap: canvas.transferToImageBitmap(),
    width: source.width,
    height: source.height,
    name: source.name,
    exif: source.exif,
    exifSegment: source.exifSegment,
  };
}

// Renders a source image, optionally applying a per-pixel transform,
// and hands back the canvas backing store as an ImageBitmap (no copy).
async function renderImage(
  source: WorkerImage,
  evaluationId: number,
  draw: (
    ctx: OffscreenCanvasRenderingContext2D,
    canvas: OffscreenCanvas,
    source: WorkerImage
  ) => void,
  transformPixels?: Stage,
  gpuOperation?: GpuOperation,
  tileSafe = false
): Promise<WorkerImage> {
  if (
    tileSafe &&
    (source.width > IMAGE_TILE_SIZE || source.height > IMAGE_TILE_SIZE)
  ) {
    const [canvas, ctx] = createCanvas(source.width, source.height);
    const tiles: Array<[number, number, number, number]> = [];

    for (let y = 0; y < source.height; y += IMAGE_TILE_SIZE) {
      for (let x = 0; x < source.width; x += IMAGE_TILE_SIZE) {
        tiles.push([
          x,
          y,
          Math.min(IMAGE_TILE_SIZE, source.width - x),
          Math.min(IMAGE_TILE_SIZE, source.height - y),
        ]);
      }
    }

    await mapWithConcurrency(tiles, evaluationId, async ([tileX, tileY, tileWidth, tileHeight]) => {
      const [tileCanvas, tileContext] = createCanvas(tileWidth, tileHeight);
      tileContext.drawImage(
        source.bitmap,
        tileX,
        tileY,
        tileWidth,
        tileHeight,
        0,
        0,
        tileWidth,
        tileHeight
      );
      const tileSource: WorkerImage = {
        bitmap: tileCanvas.transferToImageBitmap(),
        width: tileWidth,
        height: tileHeight,
        name: source.name,
        exif: source.exif,
        exifSegment: source.exifSegment,
      };

      try {
        const tile = await renderImage(
          tileSource,
          evaluationId,
          draw,
          transformPixels,
          undefined,
          false
        );

        ctx.drawImage(tile.bitmap, tileX, tileY);
        tile.bitmap.close();
      } finally {
        tileSource.bitmap.close();
      }
    });

    return {
      bitmap: canvas.transferToImageBitmap(),
      width: source.width,
      height: source.height,
      name: source.name,
      exif: source.exif,
      exifSegment: source.exifSegment,
    };
  }

  if (gpuOperation) {
    const gpuImage = renderGpuImage(source, gpuOperation);
    if (gpuImage) return gpuImage;
  }

  const [canvas, ctx] = createCanvas(source.width, source.height);

  draw(ctx, canvas, source);

  if (transformPixels) {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    transformPixels(pixels);
    ctx.putImageData(pixels, 0, 0);
  }

  return {
    bitmap: canvas.transferToImageBitmap(),
    width: canvas.width,
    height: canvas.height,
    name: source.name,
    exif: source.exif,
    exifSegment: source.exifSegment,
  };
}

function renderImages(
  sources: WorkerImage[],
  evaluationId: number,
  draw: (
    ctx: OffscreenCanvasRenderingContext2D,
    canvas: OffscreenCanvas,
    source: WorkerImage
  ) => void,
  transformPixels?: Stage,
  gpuOperation?: GpuOperation
): Promise<WorkerImage[]> {
  return mapWithConcurrency(sources, evaluationId, (source) =>
    renderImage(
      source,
      evaluationId,
      draw,
      transformPixels,
      gpuOperation,
      Boolean(transformPixels || gpuOperation) &&
        !NON_TILE_SAFE_GPU_OPERATIONS.has(gpuOperation?.kind as GpuOperation["kind"])
    )
  );
}

function splitChannels(
  sources: WorkerImage[],
  evaluationId: number
): Promise<Record<"red" | "green" | "blue" | "alpha", WorkerImage[]>> {
  return mapWithConcurrency(sources, evaluationId, async (source) => {
    const [, ctx] = createCanvas(source.width, source.height);
    ctx.drawImage(source.bitmap, 0, 0);
    const pixels = ctx.getImageData(0, 0, source.width, source.height).data;
    const channels = {
      red: new Uint8ClampedArray(pixels.length),
      green: new Uint8ClampedArray(pixels.length),
      blue: new Uint8ClampedArray(pixels.length),
      alpha: new Uint8ClampedArray(pixels.length),
    };

    for (let index = 0; index < pixels.length; index += 4) {
      channels.red[index] = pixels[index];
      channels.green[index + 1] = pixels[index + 1];
      channels.blue[index + 2] = pixels[index + 2];
      channels.alpha[index] = channels.alpha[index + 1] = channels.alpha[index + 2] = pixels[index + 3];
      channels.red[index + 3] = channels.green[index + 3] = channels.blue[index + 3] = channels.alpha[index + 3] = 255;
    }

    const createChannelImage = (channel: Uint8ClampedArray, name: string): WorkerImage => {
      const channelCanvas = new OffscreenCanvas(source.width, source.height);
      const channelContext = channelCanvas.getContext("2d");
      if (!channelContext) throw new Error("Could not create canvas context");
      const imageData = channelContext.createImageData(source.width, source.height);
      imageData.data.set(channel);
      channelContext.putImageData(imageData, 0, 0);
      return {
        bitmap: channelCanvas.transferToImageBitmap(),
        width: source.width,
        height: source.height,
        name: `${source.name ?? "image"}-${name}`,
        exif: source.exif,
        exifSegment: source.exifSegment,
      };
    };

    return Promise.resolve({
      red: [createChannelImage(channels.red, "red")],
      green: [createChannelImage(channels.green, "green")],
      blue: [createChannelImage(channels.blue, "blue")],
      alpha: [createChannelImage(channels.alpha, "alpha")],
    });
  }).then((channelSets) => ({
    red: channelSets.flatMap((channels) => channels.red),
    green: channelSets.flatMap((channels) => channels.green),
    blue: channelSets.flatMap((channels) => channels.blue),
    alpha: channelSets.flatMap((channels) => channels.alpha),
  }));
}

function mergeChannels(
  channelInputs: Record<"red" | "green" | "blue" | "alpha", WorkerImage[]>,
  evaluationId: number
): Promise<WorkerImage[]> {
  const channelNames = ["red", "green", "blue", "alpha"] as const;
  const imageCount = Math.max(...channelNames.map((channel) => channelInputs[channel].length));

  return mapWithConcurrency(
    Array.from({ length: imageCount }, (_, index) => index),
    evaluationId,
    async (index) => {
      const channelImages = channelNames.map((channel) => channelInputs[channel][index]);
      const base = channelImages.find((image): image is WorkerImage => image !== undefined);

      if (!base) {
        throw new Error("Cannot merge an empty channel set");
      }

      const channelPixels = channelImages.map((image) => {
        if (!image) return undefined;

        const [, channelContext] = createCanvas(base.width, base.height);
        channelContext.drawImage(image.bitmap, 0, 0, base.width, base.height);
        return channelContext.getImageData(0, 0, base.width, base.height).data;
      });
      const imageData = new Uint8ClampedArray(base.width * base.height * 4);

      for (let pixel = 0; pixel < imageData.length; pixel += 4) {
        imageData[pixel] = channelPixels[0]?.[pixel] ?? 0;
        imageData[pixel + 1] = channelPixels[1]?.[pixel + 1] ?? 0;
        imageData[pixel + 2] = channelPixels[2]?.[pixel + 2] ?? 0;
        imageData[pixel + 3] = channelPixels[3]?.[pixel] ?? 255;
      }

      const [canvas, context] = createCanvas(base.width, base.height);
      const output = context.createImageData(base.width, base.height);
      output.data.set(imageData);
      context.putImageData(output, 0, 0);

      return {
        bitmap: canvas.transferToImageBitmap(),
        width: base.width,
        height: base.height,
        name: base.name?.replace(/-(red|green|blue|alpha)$/, "") ?? "image",
        exif: base.exif,
        exifSegment: base.exifSegment,
      };
    }
  );
}

type Point = { x: number; y: number };

function drawTriangle(
  ctx: OffscreenCanvasRenderingContext2D,
  source: [Point, Point, Point],
  destination: [Point, Point, Point],
  bitmap: ImageBitmap
) {
  const [a, b, c] = source;
  const [u, v, w] = destination;
  const determinant = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);

  if (Math.abs(determinant) < 0.001) return;

  const m11 = ((v.x - u.x) * (c.y - a.y) - (w.x - u.x) * (b.y - a.y)) / determinant;
  const m12 = ((v.y - u.y) * (c.y - a.y) - (w.y - u.y) * (b.y - a.y)) / determinant;
  const m21 = ((w.x - u.x) * (b.x - a.x) - (v.x - u.x) * (c.x - a.x)) / determinant;
  const m22 = ((w.y - u.y) * (b.x - a.x) - (v.y - u.y) * (c.x - a.x)) / determinant;
  const dx = u.x - m11 * a.x - m21 * a.y;
  const dy = u.y - m12 * a.x - m22 * a.y;
  const center = {
    x: (u.x + v.x + w.x) / 3,
    y: (u.y + v.y + w.y) / 3,
  };
  const expand = (point: Point): Point => {
    const length = Math.hypot(point.x - center.x, point.y - center.y) || 1;
    const overlap = 1.25;
    return {
      x: point.x + ((point.x - center.x) / length) * overlap,
      y: point.y + ((point.y - center.y) / length) * overlap,
    };
  };
  const clipDestination = [expand(u), expand(v), expand(w)] as [Point, Point, Point];

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(clipDestination[0].x, clipDestination[0].y);
  ctx.lineTo(clipDestination[1].x, clipDestination[1].y);
  ctx.lineTo(clipDestination[2].x, clipDestination[2].y);
  ctx.closePath();
  ctx.clip();
  ctx.setTransform(m11, m12, m21, m22, dx, dy);
  ctx.drawImage(bitmap, 0, 0);
  ctx.restore();
}

function drawPerspective(
  ctx: OffscreenCanvasRenderingContext2D,
  canvas: OffscreenCanvas,
  source: WorkerImage,
  offsets: number[]
) {
  const points: [Point, Point, Point, Point] = [
    { x: offsets[0] * canvas.width / 100, y: offsets[1] * canvas.height / 100 },
    { x: canvas.width * (1 + offsets[2] / 100), y: offsets[3] * canvas.height / 100 },
    { x: offsets[4] * canvas.width / 100, y: canvas.height * (1 + offsets[5] / 100) },
    { x: canvas.width * (1 + offsets[6] / 100), y: canvas.height * (1 + offsets[7] / 100) },
  ];
  const divisions = 16;

  for (let row = 0; row < divisions; row += 1) {
    for (let column = 0; column < divisions; column += 1) {
      const x0 = column / divisions;
      const x1 = (column + 1) / divisions;
      const y0 = row / divisions;
      const y1 = (row + 1) / divisions;
      const sourceCorners: [Point, Point, Point, Point] = [
        { x: x0 * source.width, y: y0 * source.height },
        { x: x1 * source.width, y: y0 * source.height },
        { x: x0 * source.width, y: y1 * source.height },
        { x: x1 * source.width, y: y1 * source.height },
      ];
      const interpolate = (x: number, y: number): Point => ({
        x: points[0].x * (1 - x) * (1 - y) + points[1].x * x * (1 - y) + points[2].x * (1 - x) * y + points[3].x * x * y,
        y: points[0].y * (1 - x) * (1 - y) + points[1].y * x * (1 - y) + points[2].y * (1 - x) * y + points[3].y * x * y,
      });
      const destinationCorners: [Point, Point, Point, Point] = [interpolate(x0, y0), interpolate(x1, y0), interpolate(x0, y1), interpolate(x1, y1)];
      drawTriangle(ctx, [sourceCorners[0], sourceCorners[1], sourceCorners[2]], [destinationCorners[0], destinationCorners[1], destinationCorners[2]], source.bitmap);
      drawTriangle(ctx, [sourceCorners[1], sourceCorners[3], sourceCorners[2]], [destinationCorners[1], destinationCorners[3], destinationCorners[2]], source.bitmap);
    }
  }
}

async function scaleImage(source: WorkerImage, scale: number): Promise<WorkerImage> {
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));

  if (width === source.width && height === source.height) {
    return source;
  }

  try {
    const bitmap = await createImageBitmap(source.bitmap, {
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: "high",
    });

    return {
      bitmap,
      width,
      height,
      name: source.name,
      exif: source.exif,
      exifSegment: source.exifSegment,
    };
  } catch {
    // Keep a canvas fallback for browsers without bitmap resizing support.
  }

  const [canvas, ctx] = createCanvas(width, height);

  ctx.drawImage(source.bitmap, 0, 0, width, height);

  return {
    bitmap: canvas.transferToImageBitmap(),
    width,
    height,
    name: source.name,
    exif: source.exif,
    exifSegment: source.exifSegment,
  };
}

// ============================================================
// AI Async image-edit nodes (colorizer, denoiser, ...)
// ============================================================

const OPENAI_IMAGES_EDIT_URL = "https://api.openai.com/v1/images/edits";
const AI_IMAGE_EDIT_MODEL = "gpt-image-2";
const OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const AI_ASK_MODEL = "gpt-4o-mini";

// Node types that share the passthru/apiKey data shape.
const AI_IMAGE_EDIT_NODE_TYPES = new Set(["ai-colorizer", "ai-denoiser", "ai-negative-converter", "ai-photo-editor"]);

const AI_COLORIZER_PROMPT = [
  "Colorize this photograph realistically.",
  "If the source image is black and white, restore natural and historically plausible colors.",
  "If the source image already contains some color, preserve it and improve only where appropriate.",
  "Preserve the original photograph as faithfully as possible.",
  "Do not change the composition, camera angle, perspective, geometry, identity, facial features, expressions, poses, clothing, objects, architecture, or background.",
  "Do not add or remove people or objects.",
  "Do not invent details that are not present in the source.",
  "Preserve the original lighting and photographic character.",
  "Use realistic skin tones, materials, vegetation, sky and environmental colors.",
  "Avoid cinematic color grading, excessive saturation, HDR effects, artificial sharpening, or a modern stylized look.",
  "The result should look like the original photograph was naturally captured in color.",
].join(" ");

const AI_DENOISER_PROMPT = [
  "Reduce excessive film grain, scan noise, and digital noise while preserving the natural texture and fine detail of the original photograph.",
  "Remove noise selectively rather than applying aggressive smoothing, with particular care around faces, hair, skin, fabric, foliage, architecture, and other areas containing genuine texture.",
  "Preserve authentic film grain where it contributes to the original photographic character.",
  "Do not introduce artificial sharpening, plastic-looking skin, invented texture, excessive smoothing, HDR effects, or a modern digital appearance.",
  "Preserve the original composition, geometry, identity, facial features, expressions, poses, objects, lighting, tonal relationships, and photographic character.",
  "The result should look like the same photograph captured or scanned with less distracting degradation, not like a newly generated image.",
].join(" ");

function negativeConversionPrompt(source: WorkerImage): string {
  const [, context] = createCanvas(96, 96);
  context.drawImage(source.bitmap, 0, 0, 96, 96);
  const base = detectFilmBaseColor(context.getImageData(0, 0, 96, 96));
  const metadata = Object.entries(source.exif ?? {})
    .filter(([, value]) => value !== undefined && value !== null && typeof value !== "object")
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(", ")
    .slice(0, 1600);

  return [
    "Perform a faithful photographic inversion of this scanned film negative.",

    "Treat the input as an existing photograph that must be transformed, not recreated.",

    "Determine the negative process visible in the scan. If it is a color negative, account for its film-base mask and dye-layer characteristics. If it is a black-and-white negative, account for its base veil and density response. Do not assume that the mask is orange.",

    `The measured film-base color is approximately RGB(${Math.round(base[0])}, ${Math.round(base[1])}, ${Math.round(base[2])}). Use this measurement as an estimate of the unexposed film base and remove its contribution before reconstructing the positive image.`,

    metadata
      ? `Scan metadata that may describe the film or capture process: ${metadata}. Treat this metadata as evidence, not as certainty.`
      : "No reliable film metadata is available. Infer only what can reasonably be determined from the scan.",

    "Perform the transformation in this conceptual order: remove the film-base density and color cast, invert the negative density into positive density, then reconstruct neutral color and tonal response.",

    "For color negatives, correct the three color channels independently because the film mask and dye layers are not neutral and are not necessarily separable by a simple RGB inversion.",

    "Preserve the photographic density relationships. Recover shadow, midtone, and highlight detail from the negative without clipping or artificially expanding dynamic range.",

    "Produce natural neutral whites, believable skin tones, and physically plausible colors consistent with the captured negative.",

    "Do not apply a cinematic look, creative color grade, HDR effect, excessive contrast, artificial saturation, or modern digital sharpening.",

    "Preserve the original frame exactly: composition, geometry, perspective, people, faces, identities, expressions, poses, clothing, objects, architecture, vegetation, sky, and background.",

    "Do not add, remove, replace, redraw, beautify, repair, or hallucinate photographic content.",

    "Preserve authentic film grain and photographic texture. Only remove artifacts that are clearly caused by the scanning or capture process.",

    "The output must be the same photograph represented as a correctly exposed positive print or professional film scan.",
  ].join(" ");
}

function postProgress(
  nodeType: string,
  nodeId: string,
  evaluationId: number,
  runId: number,
  completed: number,
  total: number,
  preview?: PipelineProgressPreview
) {
  workerScope.postMessage({
    type: "progress",
    evaluationId,
    nodeType,
    nodeId,
    runId,
    completed,
    total,
    preview,
  });
}

async function imageToPreview(source: WorkerImage): Promise<PipelineProgressPreview> {
  const scale = Math.min(
    1,
    progressPreviewMaxDimension / Math.max(source.width, source.height)
  );
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const [canvas, ctx] = createCanvas(width, height);

  ctx.drawImage(source.bitmap, 0, 0, width, height);

  return {
    blob: await canvas.convertToBlob({ type: "image/jpeg", quality: progressPreviewQuality }),
    width,
    height,
    name: source.name,
  };
}

async function imageValueToBlob(source: WorkerImage): Promise<Blob> {
  const [canvas, ctx] = createCanvas(source.width, source.height);

  ctx.drawImage(source.bitmap, 0, 0);

  return canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
}

async function imageValueToDataUrl(source: WorkerImage): Promise<string> {
  const blob = await imageValueToBlob(source);
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return `data:image/jpeg;base64,${btoa(binary)}`;
}

async function requestOpenAIClassification(
  source: WorkerImage,
  apiKey: string,
  question: string,
  signal: AbortSignal,
  evaluationId: number,
  requestQueue: AIRequestQueue
): Promise<boolean> {
  const imageUrl = await imageValueToDataUrl(source);
  const response = await requestQueue.run(
    evaluationId,
    () => fetch(OPENAI_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_ASK_MODEL,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: [
                "Answer the question about this photo.",
                "Return only valid JSON in exactly this form: {\"match\": true} or {\"match\": false}.",
                "Set match to true when the photo positively satisfies the question, otherwise set it to false.",
                `Question: ${question}`,
              ].join(" "),
            },
            { type: "image_url", image_url: { url: imageUrl, detail: "low" } },
          ],
        }],
      }),
      signal,
    })
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || `OpenAI classification failed (${response.status})`
    );
  }

  const content = data.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("OpenAI returned no classification");
  }

  const result = JSON.parse(content) as { match?: unknown };

  if (typeof result.match !== "boolean") {
    throw new Error("OpenAI returned an invalid classification");
  }

  return result.match;
}

function createAskAINodeDefinition(): PipelineNodeDefinition {
  let runSeq = 0;
  const cache = new Map<string, boolean>();

  return {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) return { positive: [], negative: [] };

      const apiKey = inputs.apiKey as string | undefined;
      const question = (inputs.question as string | undefined)?.trim() ?? "";
      const passthru = (inputs.passthru as boolean | undefined) ?? true;
      const nodeId = inputs.nodeId as string;
      const evaluationId = inputs.evaluationId as number;
      const signal = inputs.signal as AbortSignal;
      const requestQueue = inputs.aiRequestQueue as AIRequestQueue;

      if (passthru) {
        return { positive: sources, negative: [] };
      }

      if (!apiKey || !question) {
        console.error(`Ask AI: missing ${!apiKey ? "OpenAI API key" : "question"}`);
        return { positive: [], negative: [] };
      }

      const runId = ++runSeq;
      const total = sources.length;
      let completed = 0;

      postProgress("ask-ai", nodeId, evaluationId, runId, completed, total);

      const matches = await mapWithConcurrency(sources, evaluationId, async (source) => {
        const cacheKey = source.cacheKey
          ? `${source.cacheKey}:question:${question}`
          : undefined;
        let match = cacheKey ? cache.get(cacheKey) : undefined;

        if (match === undefined) {
          match = await requestOpenAIClassification(
            source,
            apiKey,
            question,
            signal,
            evaluationId,
            requestQueue
          );

          if (cacheKey) cache.set(cacheKey, match);
        }

        completed += 1;
        postProgress("ask-ai", nodeId, evaluationId, runId, completed, total);

        return match;
      });

      const positive = sources.filter((_, index) => matches[index]);
      const negative = sources.filter((_, index) => !matches[index]);

      return { positive, negative };
    },
  };
}

async function requestOpenAIImageEdit(
  source: WorkerImage,
  apiKey: string,
  prompt: string,
  signal: AbortSignal,
  evaluationId: number,
  requestQueue: AIRequestQueue
): Promise<WorkerImage> {
  const blob = await imageValueToBlob(source);

  const formData = new FormData();

  formData.append("model", AI_IMAGE_EDIT_MODEL);
  formData.append("prompt", prompt);
  formData.append("image[]", blob, "source.jpg");
  formData.append("size", "auto");
  formData.append("quality", "low");
  formData.append("output_format", "jpeg");
  formData.append("output_compression", "90");

  const response = await requestQueue.run(
    evaluationId,
    () => fetch(OPENAI_IMAGES_EDIT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
      signal,
    })
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || `OpenAI image edit failed (${response.status})`
    );
  }

  const base64 = data.data?.[0]?.b64_json;

  if (!base64) {
    throw new Error("OpenAI returned no image");
  }

  // Decode the base64 payload without the main thread's <img> element.
  const resultResponse = await fetch(`data:image/jpeg;base64,${base64}`);

  const image = await blobToWorkerImage(await resultResponse.blob(), source.name);
  image.exif = source.exif;
  image.exifSegment = source.exifSegment;
  return image;
}

// Builds a node definition for an OpenAI image-edit operation (colorize,
// denoise, ...). Each node type gets its own run counter and result
// cache, kept alive across evaluations so re-running the pipeline on an
// already-processed image reuses the cached result instead of calling
// OpenAI again.
function createAIImageEditNodeDefinition(
  nodeType: string,
  label: string,
  prompt: string | ((inputs: NodeInputs, source: WorkerImage) => string)
): PipelineNodeDefinition {
  let runSeq = 0;
  const cache = new Map<string, WorkerImage>();

  async function editImage(
    source: WorkerImage,
    apiKey: string,
    editPrompt: string,
    signal: AbortSignal,
    evaluationId: number,
    requestQueue: AIRequestQueue
  ): Promise<WorkerImage> {
    const cacheKey = source.cacheKey ? `${source.cacheKey}:prompt:${editPrompt}` : undefined;
    const cached = cacheKey ? cache.get(cacheKey) : undefined;

    if (cached) {
      return cached;
    }

    const edited = await requestOpenAIImageEdit(
      source,
      apiKey,
      editPrompt,
      signal,
      evaluationId,
      requestQueue
    );

    if (cacheKey) {
      cache.set(cacheKey, edited);
      evictAIImageCache();
    }

    return edited;
  }

  return {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const passthru = (inputs.passthru as boolean | undefined) ?? true;
      const nodeId = inputs.nodeId as string;
      const evaluationId = inputs.evaluationId as number;
      const signal = inputs.signal as AbortSignal;
      const requestQueue = inputs.aiRequestQueue as AIRequestQueue;

      if (passthru) {
        return { image: sources };
      }

      const apiKey = inputs.apiKey as string | undefined;

      if (!apiKey) {
        console.error(`${label}: missing OpenAI API key`);
        return { image: sources };
      }

      const runId = ++runSeq;
      const total = sources.length;
      let completed = 0;

      postProgress(nodeType, nodeId, evaluationId, runId, completed, total);

      const image = await mapWithConcurrency(
        sources,
        evaluationId,
        async (source) => {
          try {
            const editPrompt = typeof prompt === "function" ? prompt(inputs, source) : prompt;
            if (!editPrompt.trim()) {
              console.error(`${label}: missing edit prompt`);
              return source;
            }

            const edited = await editImage(
              source,
              apiKey,
              editPrompt,
              signal,
              evaluationId,
              requestQueue
            );

            postProgress(
              nodeType,
              nodeId,
              evaluationId,
              runId,
              completed,
              total,
              await imageToPreview(edited)
            );

            return edited;
          } catch (error) {
            // An aborted run is cancellation, not a per-image failure.
            if (signal.aborted) {
              throw new StaleEvaluationError();
            }

            console.error(`${label} failed for an image:`, error);
            return source;
          } finally {
            completed += 1;
            postProgress(nodeType, nodeId, evaluationId, runId, completed, total);
          }
        }
      );

      return { image };
    },
  };
}

// ============================================================
// Node implementations
// ============================================================

// Node types whose only parameter is a single slider value
// stored on node.data.amount.
const SLIDER_NODE_TYPES = new Set([
  "brightness",
  "highlights",
  "shadows",
  "gamma",
  "luminosity",
  "exposure",
  "contrast",
  "saturation",
  "vibrance",
  "vignette",
  "grain",
  "sharpen",
  "pop",
  "hdr",
  "hue-rotation",
  "fade",
  "rotate",
]);
const TONE_NODE_TYPES = new Set(["whites-blacks", "temperature-tint"]);
const RGB_CHANNEL_NODE_TYPES = new Set([
  "rgb-black-point",
  "rgb-white-point",
  "rgb-midtones",
]);

const drawSource = (
  ctx: OffscreenCanvasRenderingContext2D,
  _canvas: OffscreenCanvas,
  source: WorkerImage
) => ctx.drawImage(source.bitmap, 0, 0);

// Node definition for a pixel-transform stage with no parameters (invert).
function stageNode(
  createStage: () => Stage,
  gpuOperation?: GpuOperation
): PipelineNodeDefinition {
  return {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        drawSource,
        createStage(),
        gpuOperation
      );

      return { image };
    },
  };
}

// Node definition for a pixel-transform stage driven by a slider amount.
function amountStageNode(
  createStage: (amount: number) => Stage,
  defaultAmount: number,
  createGpuOperation?: (amount: number) => GpuOperation
): PipelineNodeDefinition {
  return {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? defaultAmount;

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        drawSource,
        createStage(amount),
        createGpuOperation?.(amount)
      );

      return { image };
    },
  };
}

function twoAmountStageNode(
  createStage: (first: number, second: number) => Stage,
  firstKey: string,
  secondKey: string,
  createGpuOperation?: (first: number, second: number) => GpuOperation
): PipelineNodeDefinition {
  return {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      if (sources.length === 0) return { image: [] };

      const first = (inputs[firstKey] as number | undefined) ?? 0;
      const second = (inputs[secondKey] as number | undefined) ?? 0;
      return {
        image: await renderImages(
          sources,
          inputs.evaluationId as number,
          drawSource,
          createStage(first, second),
          createGpuOperation?.(first, second)
        ),
      };
    },
  };
}

function threeAmountStageNode(
  createStage: (first: number, second: number, third: number) => Stage,
  defaultAmount: number,
  createGpuOperation?: (first: number, second: number, third: number) => GpuOperation
): PipelineNodeDefinition {
  return {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      if (sources.length === 0) return { image: [] };

      const red = (inputs.red as number | undefined) ?? defaultAmount;
      const green = (inputs.green as number | undefined) ?? defaultAmount;
      const blue = (inputs.blue as number | undefined) ?? defaultAmount;
      return {
        image: await renderImages(
          sources,
          inputs.evaluationId as number,
          drawSource,
          createStage(red, green, blue),
          createGpuOperation?.(red, green, blue)
        ),
      };
    },
  };
}

function cropImages(
  sources: WorkerImage[],
  evaluationId: number,
  topPercent: number,
  bottomPercent: number,
  leftPercent: number,
  rightPercent: number
): Promise<WorkerImage[]> {
  const top = Math.max(0, Math.min(0.9, topPercent / 100));
  const bottom = Math.max(0, Math.min(0.9, bottomPercent / 100));
  const left = Math.max(0, Math.min(0.9, leftPercent / 100));
  const right = Math.max(0, Math.min(0.9, rightPercent / 100));

  return mapWithConcurrency(sources, evaluationId, async (source) => {
    const cropWidth = Math.max(1, Math.round(source.width * (1 - left - right)));
    const cropHeight = Math.max(1, Math.round(source.height * (1 - top - bottom)));
    const offsetX = Math.min(Math.round(source.width * left), source.width - cropWidth);
    const offsetY = Math.min(Math.round(source.height * top), source.height - cropHeight);
    const [canvas, ctx] = createCanvas(cropWidth, cropHeight);

    ctx.drawImage(
      source.bitmap,
      offsetX,
      offsetY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    return {
      bitmap: canvas.transferToImageBitmap(),
      width: cropWidth,
      height: cropHeight,
      name: source.name,
      exif: source.exif,
      exifSegment: source.exifSegment,
    };
  });
}

let sourceRunSeq = 0;
let viewerRunSeq = 0;

const nodeDefinitions: Record<string, PipelineNodeDefinition> = {
  information: {
    async execute() {
      await Promise.resolve();
      return {};
    },
  },

  source: {
    async execute(inputs) {
      const files = inputs.files as File[] | undefined;

      if (!files || files.length === 0) { return { image: [] } }

      const nodeId = inputs.nodeId as string;
      const evaluationId = inputs.evaluationId as number;
      const runId = (inputs.sourceProgressRunId as number | undefined) ?? ++sourceRunSeq;
      const total = (inputs.sourceProgressTotal as number | undefined) ?? files.length;
      const completedBeforeBatch = (inputs.sourceProgressOffset as number | undefined) ?? 0;
      let completed = 0;

      postProgress("source", nodeId, evaluationId, runId, completedBeforeBatch, total);

      const image = await mapWithConcurrency(
        files,
        inputs.evaluationId as number,
        async (file) => {
          try {
            return await loadFileImage(file);
          } finally {
            completed += 1;
            postProgress("source", nodeId, evaluationId, runId, completedBeforeBatch + completed, total);
          }
        }
      );

      return { image };
    },
  },

  "pdf-source": {
    async execute(inputs) {
      const files = inputs.pdfPages as File[] | undefined;

      if (!files || files.length === 0) return { image: [] };

      const image = await mapWithConcurrency(
        files,
        inputs.evaluationId as number,
        loadFileImage
      );

      return { image };
    },
  },

  "hot-folder-read": {
    async execute(inputs) {
      const files = inputs.files as File[] | undefined;

      if (!files || files.length === 0) { return { image: [] } }

      const image = await mapWithConcurrency(
        files,
        inputs.evaluationId as number,
        loadFileImage
      );

      return { image };
    },
  },

  webcam: {
    async execute(inputs) {
      const files = inputs.files as File[] | undefined;

      if (!files || files.length === 0) return { image: [] };

      return { image: [await loadFileImage(files[0])] };
    },
  },

  "screen-share": {
    async execute(inputs) {
      const files = inputs.files as File[] | undefined;

      if (!files || files.length === 0) return { image: [] };

      return { image: [await loadFileImage(files[0])] };
    },
  },

  "google-drive": {
    async execute(inputs) {
      const files = inputs.files as File[] | undefined;

      if (!files || files.length === 0) { return { image: [] } }

      const image = await mapWithConcurrency(
        files.slice(0, 10),
        inputs.evaluationId as number,
        loadFileImage
      );

      return { image };
    },
  },

  selection: {
    async execute(inputs) {
      const photos = inputs.photos as undefined;

      if (!photos || photos.length === 0) { return { image: [] } }

      const signal = inputs.signal as AbortSignal;

      const image = await mapWithConcurrency(
        photos,
        inputs.evaluationId as number,
        (photo) => loadUrlImage(photo, photo.title, signal)
      );

      return { image };
    },
  },

  grouper: {
    async execute(inputs) {
      const imageInputs = ["image-1", "image-2", "image-3", "image-4"];
      const image = imageInputs.flatMap((input) => {
        const photoArray = inputs[input];

        return Array.isArray(photoArray)
          ? photoArray as WorkerImage[]
          : [];
      });

      return { image };
    },
  },

  "split-channels": {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      if (sources.length === 0) {
        return { red: [], green: [], blue: [], alpha: [] };
      }

      return splitChannels(sources, inputs.evaluationId as number);
    },
  },

  "merge-channels": {
    async execute(inputs) {
      const channelInputs = {
        red: Array.isArray(inputs.red) ? inputs.red as WorkerImage[] : [],
        green: Array.isArray(inputs.green) ? inputs.green as WorkerImage[] : [],
        blue: Array.isArray(inputs.blue) ? inputs.blue as WorkerImage[] : [],
        alpha: Array.isArray(inputs.alpha) ? inputs.alpha as WorkerImage[] : [],
      };

      if (Object.values(channelInputs).every((images) => images.length === 0)) {
        return { image: [] };
      }

      return {
        image: await mergeChannels(channelInputs, inputs.evaluationId as number),
      };
    },
  },

  collage: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      if (sources.length === 0) return { image: [] };

      const columns = Math.max(1, Math.round(Number(inputs.columns) || 5));
      const rows = Math.max(1, Math.round(Number(inputs.rows) || 5));
      const tileWidth = Math.max(1, Math.round(Number(inputs.tileWidth) || 200));
      const tileHeight = Math.max(1, Math.round(Number(inputs.tileHeight) || 200));
      const groupSize = columns * rows;
      const image: WorkerImage[] = [];

      for (let start = 0; start < sources.length; start += groupSize) {
        throwIfStale(inputs.evaluationId as number);
        const [canvas, ctx] = createCanvas(columns * tileWidth, rows * tileHeight);
        const group = sources.slice(start, start + groupSize);

        group.forEach((source, index) => {
          const column = index % columns;
          const row = Math.floor(index / columns);
          ctx.drawImage(
            source.bitmap,
            column * tileWidth,
            row * tileHeight,
            tileWidth,
            tileHeight
          );
        });

        image.push({
          bitmap: canvas.transferToImageBitmap(),
          width: canvas.width,
          height: canvas.height,
          name: `collage-${Math.floor(start / groupSize) + 1}`,
        });
      }

      return { image };
    },
  },

  "array-switch": {
    async execute(inputs) {
      const selectedInput = Number(inputs.selectedInput) === 2 ? "image-2" : "image-1";
      const image = inputs[selectedInput];

      return { image: Array.isArray(image) ? image as WorkerImage[] : [] };
    },
  },

  "array-and": {
    async execute(inputs) {
      const first = Array.isArray(inputs["image-1"]) ? inputs["image-1"] as WorkerImage[] : [];
      const second = Array.isArray(inputs["image-2"]) ? inputs["image-2"] as WorkerImage[] : [];
      const secondKeys = new Set(second.map(getImageSetKey));

      return { image: first.filter((image) => secondKeys.has(getImageSetKey(image))) };
    },
  },

  "array-and-not": {
    async execute(inputs) {
      const first = Array.isArray(inputs["image-1"]) ? inputs["image-1"] as WorkerImage[] : [];
      const second = Array.isArray(inputs["image-2"]) ? inputs["image-2"] as WorkerImage[] : [];
      const secondKeys = new Set(second.map(getImageSetKey));

      return { image: first.filter((image) => !secondKeys.has(getImageSetKey(image))) };
    },
  },

  "array-or": {
    async execute(inputs) {
      const first = Array.isArray(inputs["image-1"]) ? inputs["image-1"] as WorkerImage[] : [];
      const second = Array.isArray(inputs["image-2"]) ? inputs["image-2"] as WorkerImage[] : [];
      const seen = new Set<string | ImageBitmap>();
      const image = [...first, ...second].filter((item) => {
        const key = getImageSetKey(item);

        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return { image };
    },
  },

  "image-picker": {
    async execute(inputs) {
      const images = Array.isArray(inputs.image) ? inputs.image as WorkerImage[] : [];
      const selectedKeys = new Set(
        Array.isArray(inputs.selectedImageKeys)
          ? inputs.selectedImageKeys.filter((key): key is string => typeof key === "string")
          : []
      );
      const image = images.filter((item, index) => selectedKeys.has(`${item.name ?? ""}\u0000${index}`));

      return { image, pickerPreview: images };
    },
  },

  "exif-split": {
    async execute(inputs) {
      const images = (inputs.image as WorkerImage[] | undefined) ?? [];
      const withExif = images.filter((image) => image.exif !== undefined);
      const withoutExif = images.filter((image) => image.exif === undefined);

      return { withExif, withoutExif };
    },
  },

  "gps-split": {
    async execute(inputs) {
      const images = (inputs.image as WorkerImage[] | undefined) ?? [];
      const hasCoordinate = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
      const getCoordinate = (image: WorkerImage, key: string) => image.exif?.[key];
      const withGps = images.filter((image) => {
        const latitude = getCoordinate(image, "latitude") ?? getCoordinate(image, "GPSLatitude");
        const longitude = getCoordinate(image, "longitude") ?? getCoordinate(image, "GPSLongitude");

        return hasCoordinate(latitude) && hasCoordinate(longitude)
          && latitude >= -90 && latitude <= 90
          && longitude >= -180 && longitude <= 180;
      });
      const withoutGps = images.filter((image) => !withGps.includes(image));

      return { withGps, withoutGps };
    },
  },

  invert: stageNode(invertStage, { kind: "invert" }),
  "black-white": stageNode(blackAndWhiteStage, { kind: "black-white" }),
  sepia: stageNode(sepiaStage, { kind: "sepia" }),

  lut: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      const file = inputs.lutFile as File | undefined;

      if (sources.length === 0 || !file) return { image: sources };

      const lut = parseCubeLut(await file.text());
      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        drawSource,
        lutStage(lut)
      );

      return { image };
    },
  },

  flip: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        (ctx, canvas, source) => {
          // Rotate 180deg around the canvas center.
          ctx.translate(canvas.width, canvas.height);
          ctx.rotate(Math.PI);
          ctx.drawImage(source.bitmap, 0, 0);
        }
      );

      return { image };
    },
  },

  mirror: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        (ctx, canvas, source) => {
          // Flip horizontally around the canvas's vertical center axis.
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(source.bitmap, 0, 0);
        }
      );

      return { image };
    },
  },

  rotate: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const angle = (inputs.amount as number | undefined) ?? 0;
      const radians = (angle * Math.PI) / 180;

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        (ctx, canvas, source) => {
          // Rotate around the canvas center; the canvas keeps the source's
          // dimensions, so corners can clip at non-90deg angles.
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(radians);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
          ctx.drawImage(source.bitmap, 0, 0);
        }
      );

      return { image };
    },
  },

  perspective: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      if (sources.length === 0) { return { image: [] }; }

      const offsets = (inputs.perspectiveOffsets as number[] | undefined) ?? [0, 0, 0, 0, 0, 0, 0, 0];
      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        (ctx, canvas, source) => drawPerspective(ctx, canvas, source, offsets)
      );

      return { image };
    },
  },

  crop: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const image = await cropImages(
        sources,
        inputs.evaluationId as number,
        (inputs.cropTop as number | undefined) ?? 0,
        (inputs.cropBottom as number | undefined) ?? 0,
        (inputs.cropLeft as number | undefined) ?? 0,
        (inputs.cropRight as number | undefined) ?? 0
      );

      return { image };
    },
  },

  brightness: amountStageNode(brightnessStage, 0, (amount) => ({ kind: "brightness", params: [amount] })),
  highlights: amountStageNode(highlightsStage, 0, (amount) => ({ kind: "highlights", params: [amount / 100] })),
  shadows: amountStageNode(shadowsStage, 0, (amount) => ({ kind: "shadows", params: [amount / 100] })),
  gamma: amountStageNode(gammaStage, 1, (amount) => ({ kind: "gamma", params: [amount] })),
  luminosity: amountStageNode(luminosityStage, 0, (amount) => ({ kind: "luminosity", params: [amount] })),
  exposure: amountStageNode(exposureStage, 0, (amount) => ({ kind: "exposure", params: [amount] })),
  contrast: amountStageNode(contrastStage, 0, (amount) => ({ kind: "contrast", params: [amount] })),
  saturation: amountStageNode(saturationStage, 0, (amount) => ({ kind: "saturation", params: [amount] })),
  vibrance: amountStageNode(vibranceStage, 0, (amount) => ({ kind: "vibrance", params: [amount] })),
  vignette: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      if (sources.length === 0) return { image: [] };

      const amount = (inputs.amount as number | undefined) ?? 0;
      const color = (inputs.color as [number, number, number] | undefined) ?? [0, 0, 0];
      return {
        image: await renderImages(
          sources,
          inputs.evaluationId as number,
          drawSource,
          vignetteStage(amount, color),
          { kind: "vignette", params: [amount, color[0] / 255, color[1] / 255, color[2] / 255] }
        ),
      };
    },
  },
  grain: amountStageNode(grainStage, 0, (amount) => ({ kind: "grain", params: [amount] })),
  sharpen: amountStageNode(sharpenStage, 0, (amount) => ({ kind: "sharpen", params: [amount] })),
  pop: amountStageNode(popStage, 0, (amount) => ({ kind: "pop", params: [amount] })),
  hdr: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      if (sources.length === 0) return { image: [] };

      const amount = (inputs.amount as number | undefined) ?? 0;
      const radius = (inputs.radius as number | undefined) ?? 12;
      return {
        image: await renderImages(
          sources,
          inputs.evaluationId as number,
          drawSource,
          hdrEffectStage(amount, radius),
          { kind: "hdr", params: [amount, radius] }
        ),
      };
    },
  },
  "hue-rotation": amountStageNode(hueRotationStage, 0, (amount) => ({ kind: "hue-rotation", params: [amount] })),
  "film-base-remover": {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      if (sources.length === 0) return { image: [] };

      const mask = (inputs.maskColor as [number, number, number] | undefined) ?? [255, 128, 48];
      const strength = (inputs.strength as number | undefined) ?? 100;
      const densityCompensation = (inputs.densityCompensation as number | undefined) ?? 0;
      const filmAge = (inputs.filmAge as number | undefined) ?? 0;
      const autoDetectBase = inputs.autoDetectBase === true;

      const image = await mapWithConcurrency(sources, inputs.evaluationId as number, async (source) => {
        let activeMask = mask;
        if (autoDetectBase) {
          const [, context] = createCanvas(source.width, source.height);
          context.drawImage(source.bitmap, 0, 0);
          activeMask = detectFilmBaseColor(context.getImageData(0, 0, source.width, source.height));
        }

        const operation = {
          kind: "film-base-remover" as const,
          params: [activeMask[0], activeMask[1], activeMask[2], strength / 100, densityCompensation, filmAge] as [number, number, number, number, number, number],
        };
        return renderImage(
          source,
          inputs.evaluationId as number,
          drawSource,
          filmBaseRemoverStage(activeMask[0], activeMask[1], activeMask[2], strength, densityCompensation, filmAge),
          operation
        );
      });

      return {
        image,
      };
    },
  },
  fade: amountStageNode(fadeStage, 0, (amount) => ({ kind: "fade", params: [amount] })),
  "whites-blacks": twoAmountStageNode(whitesBlacksStage, "whites", "blacks", (whites, blacks) => ({ kind: "whites-blacks", params: [whites, blacks] })),
  "temperature-tint": twoAmountStageNode(temperatureTintStage, "temperature", "tint", (temperature, tint) => ({ kind: "temperature-tint", params: [temperature, tint] })),
  "rgb-black-point": threeAmountStageNode(rgbBlackPointStage, 0, (red, green, blue) => ({ kind: "rgb-black-point", params: [red, green, blue] })),
  "rgb-white-point": threeAmountStageNode(rgbWhitePointStage, 255, (red, green, blue) => ({ kind: "rgb-white-point", params: [red, green, blue] })),
  "rgb-midtones": threeAmountStageNode(rgbMidtonesStage, 1, (red, green, blue) => ({ kind: "rgb-midtones", params: [red, green, blue] })),
  "split-toning": {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      if (sources.length === 0) return { image: [] };
      const shadow = (inputs.shadowTint as [number, number, number] | undefined) ?? [48, 64, 96];
      const highlight = (inputs.highlightTint as [number, number, number] | undefined) ?? [255, 224, 176];
      const strength = ((inputs.strength as number | undefined) ?? 50) / 100;
      return { image: await renderImages(sources, inputs.evaluationId as number, drawSource, splitToningStage(...shadow, ...highlight, strength), { kind: "split-toning", params: [...shadow, ...highlight, strength] }) };
    },
  },

  "ai-colorizer": createAIImageEditNodeDefinition(
    "ai-colorizer",
    "AI Colorizer",
    AI_COLORIZER_PROMPT
  ),

  "ai-negative-converter": createAIImageEditNodeDefinition(
    "ai-negative-converter",
    "AI Negative Converter",
    (_inputs, source) => negativeConversionPrompt(source)
  ),

  "ai-denoiser": createAIImageEditNodeDefinition(
    "ai-denoiser",
    "AI Denoiser",
    AI_DENOISER_PROMPT
  ),

  "ai-photo-editor": createAIImageEditNodeDefinition(
    "ai-photo-editor",
    "AI Photo Editor",
    (inputs) => (inputs.prompt as string | undefined) ?? ""
  ),

  "ask-ai": createAskAINodeDefinition(),

  rescale: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const scale = (inputs.scale as number | undefined) ?? 1;

      if (scale === 1) {
        return { image: sources };
      }

      const image = await mapWithConcurrency(
        sources,
        inputs.evaluationId as number,
        (source) => scaleImage(source, scale)
      );

      return { image };
    },
  },

  "resize-limit": {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      const maxDimension = (inputs.maxDimension as number | undefined) ?? 4096;

      if (sources.length === 0) { return { image: [] }; }

      const image = await mapWithConcurrency(
        sources,
        inputs.evaluationId as number,
        (source) => {
          const longestSide = Math.max(source.width, source.height);

          if (longestSide <= maxDimension) {
            return Promise.resolve(source);
          }

          return scaleImage(source, maxDimension / longestSide);
        }
      );

      return { image };
    },
  },

  "selected-photo": {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];
      const selectedPhotoName = inputs.selectedPhotoName as string | undefined;

      if (!selectedPhotoName) {
        return { image: [] };
      }

      const selected = sources.find((source) => source.name === selectedPhotoName);

      return { image: selected ? [selected] : [] };
    },
  },

  // The viewer passes images through; encoding for transport to the
  // main thread happens in the result-posting layer below.
  viewer: {
    async execute(inputs) {
      await Promise.resolve();

      return {
        image: (inputs.image as WorkerImage[] | undefined) ?? [],
      };
    },
  },

  "viewer-single": {
    async execute(inputs) {
      await Promise.resolve();

      return {
        image: (inputs.image as WorkerImage[] | undefined) ?? [],
      };
    },
  },

  "exif-viewer": {
    async execute(inputs) {
      await Promise.resolve();

      return {
        image: (inputs.image as WorkerImage[] | undefined) ?? [],
      };
    },
  },

  "gps-map": {
    async execute(inputs) {
      await Promise.resolve();

      return {
        image: (inputs.image as WorkerImage[] | undefined) ?? [],
      };
    },
  },

  "photo-histogram": {
    async execute(inputs) {
      await Promise.resolve();

      return {
        image: (inputs.image as WorkerImage[] | undefined) ?? [],
      };
    },
  },

  "hot-folder-write": {
    async execute(inputs) {
      await Promise.resolve();

      return {
        image: (inputs.image as WorkerImage[] | undefined) ?? [],
      };
    },
  },
};

// ============================================================
// Transport encoding (viewer output only)
// ============================================================

// JPEG keeps the per-image encode fast and the posted payload small
// for large batches; quality matches the AI upload path.
async function encodeImagesForTransport(
  images: WorkerImage[],
  evaluationId: number,
  batchSize: number,
  nodeId: string,
  jpegQuality: number
): Promise<PipelineViewerImagePayload[]> {
  const payload: PipelineViewerImagePayload[] = [];
  const runId = ++viewerRunSeq;
  const total = images.length;
  let completed = 0;

  postProgress("viewer", nodeId, evaluationId, runId, completed, total);

  for (let start = 0; start < images.length; start += batchSize) {
    throwIfStale(evaluationId);

    const batch = await mapWithConcurrency(
      images.slice(start, start + batchSize),
      evaluationId,
      async (image) => {
        try {
          const scale = Math.min(
            1,
            viewerMaxDimension / Math.max(image.width, image.height)
          );
          const previewWidth = Math.max(1, Math.round(image.width * scale));
          const previewHeight = Math.max(1, Math.round(image.height * scale));
          const [canvas, ctx] = createCanvas(previewWidth, previewHeight);

          ctx.drawImage(image.bitmap, 0, 0, previewWidth, previewHeight);

          const encodedBlob = await canvas.convertToBlob({
            type: "image/jpeg",
            quality: jpegQuality,
          });
          const blob = await addExifSegment(encodedBlob, image.exifSegment);

          return {
            blob,
            width: image.width,
            height: image.height,
            name: image.name,
            exif: image.exif,
          };
        } finally {
          completed += 1;
          postProgress("viewer", nodeId, evaluationId, runId, completed, total);
        }
      }
    );

    payload.push(...batch);
  }

  return payload;
}

// ============================================================
// Pipeline evaluator
// ============================================================

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

type CachedNodeOutput = {
  outputs: NodeOutputs;
};

// Keep phase results by their content signature rather than node id. This
// lets equivalent phases share the same in-worker ImageBitmaps across runs.
const phaseOutputCache = new Map<string, CachedNodeOutput>();

function getCachedPhaseOutput(signature: string): NodeOutputs | undefined {
  const cached = phaseOutputCache.get(signature);

  if (!cached) return undefined;

  // Refresh insertion order so frequently reused phases stay resident.
  phaseOutputCache.delete(signature);
  phaseOutputCache.set(signature, cached);

  return cached.outputs;
}

function cachePhaseOutput(signature: string, outputs: NodeOutputs) {
  const replaced = phaseOutputCache.get(signature);
  phaseOutputCache.delete(signature);
  phaseOutputCache.set(signature, { outputs });

  if (replaced && replaced.outputs !== outputs) {
    retireBitmaps(replaced.outputs);
  }

  while (getBitmapBytes(getCachedBitmapsFromPhaseCache()) > phaseCacheLimitBytes) {
    const oldestSignature = phaseOutputCache.keys().next().value;

    if (oldestSignature === undefined) break;

    const evicted = phaseOutputCache.get(oldestSignature);
    phaseOutputCache.delete(oldestSignature);

    if (evicted) {
      retireBitmaps(evicted.outputs);
    }
  }
}

function getBitmapBytes(bitmaps: Set<ImageBitmap>): number {
  let bytes = 0;

  for (const bitmap of bitmaps) {
    bytes += bitmap.width * bitmap.height * 4;
  }

  return bytes;
}

function outputOnlyReferencesInputs(outputs: NodeOutputs, inputs: NodeInputs): boolean {
  const outputBitmaps = new Set<ImageBitmap>();
  const inputBitmaps = new Set<ImageBitmap>();

  collectBitmaps(outputs, outputBitmaps);

  for (const value of Object.values(inputs)) {
    collectBitmaps(value, inputBitmaps);
  }

  return outputBitmaps.size > 0 && [...outputBitmaps].every((bitmap) => inputBitmaps.has(bitmap));
}

function collectBitmaps(
  value: unknown,
  bitmaps: Set<ImageBitmap>
) {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectBitmaps(item, bitmaps);
    }
    return;
  }

  if (value && typeof value === "object" && "bitmap" in value) {
    const bitmap = (value as { bitmap?: unknown }).bitmap;

    if (bitmap instanceof ImageBitmap) {
      bitmaps.add(bitmap);
    }
  }
}

function getCachedBitmapsFromPhaseCache(): Set<ImageBitmap> {
  const bitmaps = new Set<ImageBitmap>();

  for (const cached of phaseOutputCache.values()) {
    collectBitmaps(cached.outputs, bitmaps);
  }

  return bitmaps;
}

function getCachedBitmaps(): Set<ImageBitmap> {
  const bitmaps = getCachedBitmapsFromPhaseCache();

  for (const cache of aiImageCaches) {
    collectBitmaps([...cache.values()], bitmaps);
  }

  return bitmaps;
}

function getAICacheBytes(): number {
  const bitmaps = new Set<ImageBitmap>();

  for (const cache of aiImageCaches) {
    collectBitmaps([...cache.values()], bitmaps);
  }

  return getBitmapBytes(bitmaps);
}

function evictAIImageCache() {
  while (getAICacheBytes() > aiCacheLimitBytes) {
    let oldestCache: Map<string, WorkerImage> | undefined;
    let oldestKey: string | undefined;

    for (const cache of aiImageCaches) {
      const key = cache.keys().next().value;

      if (key !== undefined) {
        oldestCache = cache;
        oldestKey = key;
        break;
      }
    }

    if (!oldestCache || oldestKey === undefined) break;

    const evicted = oldestCache.get(oldestKey);
    oldestCache.delete(oldestKey);

    if (evicted) {
      retiredBitmaps.add(evicted.bitmap);
    }
  }
}

function retireBitmaps(outputs: NodeOutputs) {
  collectBitmaps(outputs, retiredBitmaps);
}

function closeRetiredBitmaps(activeOutputs: Iterable<NodeOutputs>) {
  const activeBitmaps = getCachedBitmaps();

  for (const output of activeOutputs) {
    collectBitmaps(output, activeBitmaps);
  }

  for (const bitmap of retiredBitmaps) {
    if (!activeBitmaps.has(bitmap)) {
      bitmap.close();
    }
  }

  retiredBitmaps.clear();
}

function getEstimatedCacheBytes(): number {
  let bytes = getBitmapBytes(getCachedBitmaps());

  if (gpuRenderer) {
    bytes += gpuRenderer.canvas.width * gpuRenderer.canvas.height * 4;
    bytes += gpuRenderer.textureWidth * gpuRenderer.textureHeight * 4;
  }

  return bytes;
}

function serializeForCache(value: unknown): string {
  if (value instanceof File) {
    return JSON.stringify({
      type: "File",
      name: value.name,
      size: value.size,
      lastModified: value.lastModified,
      typeName: value.type,
    });
  }

  if (value instanceof Blob) {
    return JSON.stringify({
      type: "Blob",
      size: value.size,
      typeName: value.type,
    });
  }

  if (Array.isArray(value)) {
    return `[${value.map(serializeForCache).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${serializeForCache(entry)}`);

    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value);
}

async function runEvaluation(
  message: PipelineEvaluateMessage,
  signal: AbortSignal
): Promise<void> {
  const { evaluationId, nodes, edges } = message;
  const startedAt = performance.now();
  imageConcurrencyLimit = Math.max(
    1,
    Math.min(8, Math.round(message.imageConcurrency) || DEFAULT_IMAGE_CONCURRENCY)
  );
  phaseCacheLimitBytes = Math.max(
    0,
    Math.min(
      1024 * 1024 * 1024,
      Number.isFinite(message.phaseCacheBytes)
        ? Math.round(message.phaseCacheBytes)
        : DEFAULT_PHASE_CACHE_BYTES
    )
  );
  aiCacheLimitBytes = Math.max(
    0,
    Math.min(
      512 * 1024 * 1024,
      Number.isFinite(message.aiCacheBytes)
        ? Math.round(message.aiCacheBytes)
        : DEFAULT_AI_CACHE_BYTES
    )
  );
  viewerMaxDimension = Math.max(
    256,
    Math.min(4096, Math.round(message.viewerMaxDimension) || 1600)
  );
  progressPreviewMaxDimension = Math.max(
    128,
    Math.min(1600, Math.round(message.progressPreviewMaxDimension) || 480)
  );
  progressPreviewQuality = Math.max(
    0.1,
    Math.min(1, message.progressPreviewQuality || 0.84)
  );
  const taskQueue = new PipelineTaskQueue(
    message.sequentialMode
      ? 1
      : Math.max(1, Math.min(32, Math.round(message.maxConcurrentTasks) || 5))
  );
  const aiRequestQueue = new AIRequestQueue(
    Math.max(1, Math.min(32, Math.round(message.maxAIRequests) || 2)),
    Math.max(0, Math.min(10000, Math.round(message.aiCallDelayMs) || 0))
  );

  const outputs = new Map<string, Promise<NodeOutputs>>();
  const signatures = new Map<string, string>();

  const evaluateNode = (nodeId: string): Promise<NodeOutputs> => {
    // Already evaluating?
    const existing = outputs.get(nodeId);

    if (existing) {
      return existing;
    }

    const node = nodes.find((n) => n.id === nodeId);

    if (!node) {
      return Promise.reject(new Error(`Node ${nodeId} not found`));
    }

    const definition = nodeDefinitions[node.type ?? ""];

    if (!definition) {
      return Promise.reject(new Error(`No definition for ${node.type}`));
    }

    const promise = (async () => {
      throwIfStale(evaluationId);

      const incoming = edges.filter((edge) => edge.target === nodeId);

      const inputEntries = message.sequentialMode
        ? await incoming.reduce<Promise<Array<readonly [string, unknown]>>>(
          async (entriesPromise, edge) => {
            const entries = await entriesPromise;
            const upstream = await evaluateNode(edge.source);
            entries.push([
              edge.targetHandle ?? "input",
              upstream[edge.sourceHandle ?? "output"],
            ] as const);
            return entries;
          },
          Promise.resolve([])
        )
        : await Promise.all(
          incoming.map(async (edge) => {
            const upstream = await evaluateNode(edge.source);

            return [
              edge.targetHandle ?? "input",
              upstream[edge.sourceHandle ?? "output"],
            ] as const;
          })
        );

      const inputs = Object.fromEntries(inputEntries);

      const upstreamSignatures = incoming.map((edge) => ({
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        signature: signatures.get(edge.source),
      }));

      // Special case:
      // File-backed source nodes get their Files from node.data.
      if (node.type === "pdf-source") {
        inputs.pdfPages = node.data.pdfPages;
        inputs.nodeId = node.id;
      } else if (FILE_SOURCE_NODE_TYPES.has(node.type ?? "")) {
        inputs.files = node.data.files;
        inputs.nodeId = node.id;
      }

      // Special case:
      // Selection node gets its GalleryPhotos from node.data.
      if (node.type === "selection") {
        inputs.photos = node.data.photos;
      }

      if (node.type === "selected-photo") {
        inputs.selectedPhotoName = node.data.selectedPhotoName;
      }

      if (node.type === "lut") {
        inputs.lutFile = node.data.lutFile;
      }

      if (node.type === "array-switch") {
        inputs.selectedInput = node.data.selectedInput;
      }

      if (node.type === "image-picker") {
        inputs.selectedImageKeys = node.data.selectedImageKeys;
      }

      // Special case:
      // Slider nodes get their amount from node.data.
      if (SLIDER_NODE_TYPES.has(node.type ?? "")) {
        inputs.amount = node.data.amount;
      }

      if (node.type === "vignette") {
        inputs.color = node.data.color;
      }

      if (node.type === "film-base-remover") {
        inputs.maskColor = node.data.maskColor;
        inputs.strength = node.data.strength;
        inputs.densityCompensation = node.data.densityCompensation;
        inputs.filmAge = node.data.filmAge;
        inputs.autoDetectBase = node.data.autoDetectBase;
      }

      if (node.type === "hdr") {
        inputs.radius = node.data.radius;
      }

      if (TONE_NODE_TYPES.has(node.type ?? "")) {
        inputs.whites = node.data.whites;
        inputs.blacks = node.data.blacks;
        inputs.temperature = node.data.temperature;
        inputs.tint = node.data.tint;
      }
      if (RGB_CHANNEL_NODE_TYPES.has(node.type ?? "")) {
        inputs.red = node.data.red;
        inputs.green = node.data.green;
        inputs.blue = node.data.blue;
      }
      if (node.type === "split-toning") {
        inputs.shadowTint = node.data.shadowTint;
        inputs.highlightTint = node.data.highlightTint;
        inputs.strength = node.data.strength;
      }

      // Special case:
      // AI image-edit nodes get their passthru toggle and BYOK key from node.data.
      if (AI_IMAGE_EDIT_NODE_TYPES.has(node.type ?? "")) {
        inputs.passthru = node.data.passthru;
        inputs.apiKey = node.data.apiKey;
        inputs.prompt = node.data.prompt;
        inputs.nodeId = node.id;
      }

      if (node.type === "ask-ai") {
        inputs.passthru = node.data.passthru;
        inputs.apiKey = node.data.apiKey;
        inputs.question = node.data.question;
        inputs.nodeId = node.id;
      }

      // Special case:
      // Rescale node gets its scale factor from node.data.
      if (node.type === "rescale") {
        inputs.scale = node.data.scale;
      }

      if (node.type === "resize-limit") {
        inputs.maxDimension = node.data.maxDimension;
      }

      if (node.type === "collage") {
        inputs.columns = node.data.columns;
        inputs.rows = node.data.rows;
        inputs.tileWidth = node.data.tileWidth;
        inputs.tileHeight = node.data.tileHeight;
      }

      if (node.type === "crop") {
        inputs.cropTop = node.data.top;
        inputs.cropBottom = node.data.bottom;
        inputs.cropLeft = node.data.left;
        inputs.cropRight = node.data.right;
      }

      if (node.type === "perspective") {
        inputs.perspectiveOffsets = [
          node.data.topLeftx, node.data.topLefty,
          node.data.topRightx, node.data.topRighty,
          node.data.bottomLeftx, node.data.bottomLefty,
          node.data.bottomRightx, node.data.bottomRighty,
        ].map((value) => typeof value === "number" ? value : 0);
      }

      if (node.data.skip === true) {
        console.log(`⏭ skipping ${node.id}`);
        signatures.set(nodeId, serializeForCache({
          type: node.type,
          data: node.data,
          upstream: upstreamSignatures,
        }));
        const firstIncomingArray = inputEntries.find(([, value]) => Array.isArray(value))?.[1];
        return inputs.image === undefined && firstIncomingArray !== undefined
          ? { ...inputs, image: firstIncomingArray }
          : inputs;
      }

      const signature = serializeForCache({
        type: node.type,
        data: node.data,
        upstream: upstreamSignatures,
      });
      signatures.set(nodeId, signature);

      const cached = getCachedPhaseOutput(signature);
      if (cached) {
        console.log(`↺ reused ${node.id}`);
        workerScope.postMessage({
          type: "stageStarted",
          evaluationId,
          nodeType: node.type ?? "",
          nodeId: node.id,
        });
        workerScope.postMessage({
          type: "stageTiming",
          evaluationId,
          nodeType: node.type ?? "",
          nodeId: node.id,
          durationMs: 0,
        });
        return cached;
      }

      // Cancellation plumbing available to every node.
      inputs.evaluationId = evaluationId;
      inputs.signal = signal;
      inputs.aiRequestQueue = aiRequestQueue;

      if (FILE_SOURCE_NODE_TYPES.has(node.type ?? "")) {
        inputs.sourceProgressTotal = Array.isArray(inputs.files) ? inputs.files.length : 0;
        inputs.sourceProgressRunId = ++sourceRunSeq;
      }

      console.log(`▶ executing ${node.id}`);

      workerScope.postMessage({
        type: "stageStarted",
        evaluationId,
        nodeType: node.type ?? "",
        nodeId: node.id,
      });

      const startedAt = performance.now();
      const result = await executeInPhotoBatches(
        definition,
        node.type,
        inputs,
        evaluationId,
        Math.max(1, Math.min(100, Math.round(message.photoBatchSize) || 10)),
        taskQueue
      );
      const durationMs = performance.now() - startedAt;

      workerScope.postMessage({
        type: "stageTiming",
        evaluationId,
        nodeType: node.type ?? "",
        nodeId: node.id,
        durationMs,
      });

      console.log(`✓ completed ${node.id}`);

      throwIfStale(evaluationId);

      if (!outputOnlyReferencesInputs(result, inputs)) {
        cachePhaseOutput(signature, result);
      }

      if (node.type === "exif-split") {
        const withExif = result.withExif as WorkerImage[] | undefined ?? [];
        const withoutExif = result.withoutExif as WorkerImage[] | undefined ?? [];

        workerScope.postMessage({
          type: "exifStats",
          evaluationId,
          nodeId: node.id,
          total: withExif.length + withoutExif.length,
          withExif: withExif.length,
          withoutExif: withoutExif.length,
        });
      }

      if (node.type === "gps-split") {
        const withGps = result.withGps as WorkerImage[] | undefined ?? [];
        const withoutGps = result.withoutGps as WorkerImage[] | undefined ?? [];

        workerScope.postMessage({
          type: "gpsStats",
          evaluationId,
          nodeId: node.id,
          total: withGps.length + withoutGps.length,
          withGps: withGps.length,
          withoutGps: withoutGps.length,
        });
      }

      return result;
    })();

    outputs.set(nodeId, promise);

    return promise;
  };

  // Post each viewer's result as soon as it is ready instead of
  // waiting for the whole graph to finish.
  const postViewer = async (node: PipelineWorkerNode) => {
    try {
      const nodeOutputs = await evaluateNode(node.id);
      throwIfStale(evaluationId);

      const images = (node.type === "image-picker"
        ? nodeOutputs.pickerPreview
        : nodeOutputs.image) as WorkerImage[] | undefined ?? [];
      const payload = await taskQueue.run(
        evaluationId,
        () => encodeImagesForTransport(
          images,
          evaluationId,
          Math.max(1, Math.min(100, Math.round(message.photoBatchSize) || 10)),
          node.id,
          Math.max(0.1, Math.min(1, message.jpegQuality))
        )
      );

      throwIfStale(evaluationId);

      workerScope.postMessage({
        type: "viewer",
        evaluationId,
        nodeId: node.id,
        images: payload,
      });
    } catch (error: unknown) {
      // Staleness is cancellation, not failure.
      if (!(error instanceof StaleEvaluationError)) {
        console.error(`Viewer node "${node.id}" failed:`, error);
      }
    }
  };

  const viewerNodes = nodes.filter((node) => VIEWER_NODE_TYPES.has(node.type ?? ""));

  // Evaluate every node.
  if (message.sequentialMode) {
    for (const node of nodes) {
      await evaluateNode(node.id);
    }
  } else {
    await Promise.all(nodes.map((node) => evaluateNode(node.id)));
  }

  // The transport encode above is async, so without this await the
  // "done" message would overtake the viewer messages; the client
  // resolves still-pending viewers as empty on "done" and the real
  // results would be dropped.
  if (message.sequentialMode) {
    for (const node of viewerNodes) {
      await postViewer(node);
    }
  } else {
    await Promise.all(viewerNodes.map(postViewer));
  }

  closeRetiredBitmaps(await Promise.all(outputs.values()));

  throwIfStale(evaluationId);

  workerScope.postMessage({
    type: "cacheMemory",
    evaluationId,
    bytes: getEstimatedCacheBytes(),
  });

  workerScope.postMessage({
    type: "done",
    evaluationId,
    durationMs: performance.now() - startedAt,
  });
}

workerScope.onmessage = (event) => {
  const message = event.data;

  if (message.type !== "evaluate") {
    return;
  }

  // A new evaluation supersedes whatever is currently running.
  latestEvaluationId = message.evaluationId;
  activeController?.abort();

  const controller = new AbortController();
  activeController = controller;

  runEvaluation(message, controller.signal).catch((error: unknown) => {
    if (error instanceof StaleEvaluationError) {
      return;
    }

    workerScope.postMessage({
      type: "error",
      evaluationId: message.evaluationId,
      message: errorMessage(error),
    });
  });
};
