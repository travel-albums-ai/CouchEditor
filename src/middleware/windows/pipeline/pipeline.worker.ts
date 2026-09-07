// Pipeline evaluation engine, running on a dedicated worker so heavy
// per-pixel processing never blocks the main thread.
//
// Compared to the old main-thread engine:
// - Images travel between stages as ImageBitmaps, so intermediate stages
//   no longer pay a canvas.toDataURL base64 encode + <img> decode round
//   trip per image per stage. Only the final viewer output is encoded.
// - Per-image work (load / transform / encode / AI upload) is bounded by
//   MAX_CONCURRENT_IMAGE_OPS so large batches don't exhaust memory.
// - Every new evaluation cooperatively cancels the previous one: stale
//   checks run between images and in-flight fetches are aborted.

import type { GalleryPhoto } from "../../../lib/galleryData";
import { composeUrl } from "../../../lib/thumbnailService";
import type { Stage } from "../../interface/adjustments/types";
import {
  blackAndWhiteStage,
  brightnessStage,
  contrastStage,
  exposureStage,
  fadeStage,
  gammaStage,
  grainStage,
  hdrEffectStage,
  highlightsStage,
  hueRotationStage,
  invertStage,
  luminosityStage,
  popStage,
  saturationStage,
  sepiaStage,
  shadowsStage,
  sharpenStage,
  vibranceStage,
  vignetteStage,
} from "../../interface/adjustments/utils";
import type {
  NodeOutputs,
  PipelineEvaluateMessage,
  PipelineNodeDefinition,
  PipelineViewerImagePayload,
  PipelineWorkerOutbound,
} from "./types";
import { VIEWER_NODE_TYPES } from "./types";

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
  // Stable identity (thumbnail URL / file fingerprint) used as the
  // AI node result-cache key.
  cacheKey?: string;
};

// Bounds in-flight image work. The worker is single-threaded, so this
// overlaps async gaps (decode/encode/fetch) rather than CPU work.
const MAX_CONCURRENT_IMAGE_OPS = Math.max(
  2,
  Math.min(4, navigator.hardwareConcurrency ?? 4)
);

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
    { length: Math.min(MAX_CONCURRENT_IMAGE_OPS, items.length) },
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

// ============================================================
// Image loading / rendering primitives (OffscreenCanvas-based)
// ============================================================

async function blobToWorkerImage(
  blob: Blob,
  name?: string,
  cacheKey?: string
): Promise<WorkerImage> {
  const bitmap = await createImageBitmap(blob);

  return {
    bitmap,
    width: bitmap.width,
    height: bitmap.height,
    name,
    cacheKey,
  };
}

function loadFileImage(file: File): Promise<WorkerImage> {
  return blobToWorkerImage(
    file,
    file.name,
    `file:${file.name}:${file.size}:${file.lastModified}`
  );
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

  return blobToWorkerImage(await response.blob(), name, url);
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

// Renders a source image, optionally applying a per-pixel transform,
// and hands back the canvas backing store as an ImageBitmap (no copy).
function renderImage(
  source: WorkerImage,
  draw: (
    ctx: OffscreenCanvasRenderingContext2D,
    canvas: OffscreenCanvas,
    source: WorkerImage
  ) => void,
  transformPixels?: Stage
): WorkerImage {
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
  transformPixels?: Stage
): Promise<WorkerImage[]> {
  return mapWithConcurrency(sources, evaluationId, (source) =>
    Promise.resolve(renderImage(source, draw, transformPixels))
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

function scaleImage(source: WorkerImage, scale: number): WorkerImage {
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));

  const [canvas, ctx] = createCanvas(width, height);

  ctx.drawImage(source.bitmap, 0, 0, width, height);

  return {
    bitmap: canvas.transferToImageBitmap(),
    width,
    height,
    name: source.name,
  };
}

// ============================================================
// AI Async image-edit nodes (colorizer, denoiser, ...)
// ============================================================

const OPENAI_IMAGES_EDIT_URL = "https://api.openai.com/v1/images/edits";
const AI_IMAGE_EDIT_MODEL = "gpt-image-2";

// Node types that share the passthru/apiKey data shape.
const AI_IMAGE_EDIT_NODE_TYPES = new Set(["ai-colorizer", "ai-denoiser"]);

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

function postProgress(
  nodeType: string,
  nodeId: string,
  evaluationId: number,
  runId: number,
  completed: number,
  total: number
) {
  workerScope.postMessage({
    type: "progress",
    evaluationId,
    nodeType,
    nodeId,
    runId,
    completed,
    total,
  });
}

async function imageValueToBlob(source: WorkerImage): Promise<Blob> {
  const [canvas, ctx] = createCanvas(source.width, source.height);

  ctx.drawImage(source.bitmap, 0, 0);

  return canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
}

async function requestOpenAIImageEdit(
  source: WorkerImage,
  apiKey: string,
  prompt: string,
  signal: AbortSignal
): Promise<WorkerImage> {
  const blob = await imageValueToBlob(source);

  const formData = new FormData();

  formData.append("model", AI_IMAGE_EDIT_MODEL);
  formData.append("prompt", prompt);
  formData.append("image[]", blob, "source.jpg");
  formData.append("size", "auto");
  formData.append("quality", "medium");
  formData.append("output_format", "jpeg");
  formData.append("output_compression", "90");

  const response = await fetch(OPENAI_IMAGES_EDIT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
    signal,
  });

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

  return blobToWorkerImage(await resultResponse.blob(), source.name);
}

// Builds a node definition for an OpenAI image-edit operation (colorize,
// denoise, ...). Each node type gets its own run counter and result
// cache, kept alive across evaluations so re-running the pipeline on an
// already-processed image reuses the cached result instead of calling
// OpenAI again.
function createAIImageEditNodeDefinition(
  nodeType: string,
  label: string,
  prompt: string
): PipelineNodeDefinition {
  let runSeq = 0;
  const cache = new Map<string, WorkerImage>();

  async function editImage(
    source: WorkerImage,
    apiKey: string,
    signal: AbortSignal
  ): Promise<WorkerImage> {
    const cacheKey = source.cacheKey;
    const cached = cacheKey ? cache.get(cacheKey) : undefined;

    if (cached) {
      return cached;
    }

    const edited = await requestOpenAIImageEdit(source, apiKey, prompt, signal);

    if (cacheKey) {
      cache.set(cacheKey, edited);
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
            return await editImage(source, apiKey, signal);
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

const drawSource = (
  ctx: OffscreenCanvasRenderingContext2D,
  _canvas: OffscreenCanvas,
  source: WorkerImage
) => ctx.drawImage(source.bitmap, 0, 0);

// Node definition for a pixel-transform stage with no parameters (invert).
function stageNode(createStage: () => Stage): PipelineNodeDefinition {
  return {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        drawSource,
        createStage()
      );

      return { image };
    },
  };
}

// Node definition for a pixel-transform stage driven by a slider amount.
function amountStageNode(
  createStage: (amount: number) => Stage,
  defaultAmount: number
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
        createStage(amount)
      );

      return { image };
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
    };
  });
}

type CubeLut = {
  size: number;
  values: Float32Array;
  domainMin: [number, number, number];
  domainMax: [number, number, number];
};

function parseCubeLut(text: string): CubeLut {
  let lut1dSize: number | undefined;
  let lut3dSize: number | undefined;
  let domainMin: [number, number, number] = [0, 0, 0];
  let domainMax: [number, number, number] = [1, 1, 1];
  const values: number[] = [];

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.split('#', 1)[0].trim();

    if (!line) continue;

    const parts = line.split(/\s+/);
    const directive = parts[0].toUpperCase();

    if (directive === 'TITLE' || directive === 'LUT_1D_INPUT_RANGE') continue;

    if (directive === 'LUT_1D_SIZE' || directive === 'LUT_3D_SIZE') {
      const parsedSize = Number(parts[1]);

      if (!Number.isInteger(parsedSize) || parsedSize < 2) {
        throw new Error('Invalid .cube LUT size');
      }

      if (directive === 'LUT_1D_SIZE') lut1dSize = parsedSize;
      else lut3dSize = parsedSize;
      continue;
    }

    if (directive === 'DOMAIN_MIN' || directive === 'DOMAIN_MAX') {
      if (parts.length !== 4 || parts.slice(1).some((value) => !Number.isFinite(Number(value)))) {
        throw new Error(`Invalid ${directive} in .cube LUT`);
      }

      const range: [number, number, number] = [Number(parts[1]), Number(parts[2]), Number(parts[3])];
      if (directive === 'DOMAIN_MIN') domainMin = range;
      else domainMax = range;
      continue;
    }

    if (parts.length !== 3 || parts.some((value) => !Number.isFinite(Number(value)))) {
      throw new Error('Invalid data row in .cube LUT');
    }

    values.push(Number(parts[0]), Number(parts[1]), Number(parts[2]));
  }

  if (lut1dSize && lut3dSize) throw new Error('A .cube LUT cannot define both 1D and 3D tables');

  const size = lut3dSize ?? lut1dSize;
  if (!size) throw new Error('Missing LUT_1D_SIZE or LUT_3D_SIZE in .cube LUT');

  const expectedValues = lut3dSize ? size ** 3 * 3 : size * 3;
  if (values.length !== expectedValues) {
    throw new Error(`Expected ${expectedValues / 3} rows in .cube LUT, found ${values.length / 3}`);
  }

  return { size, values: new Float32Array(values), domainMin, domainMax };
}

function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function sample1d(lut: CubeLut, channel: number, value: number): number {
  const normalized = clampUnit((value - lut.domainMin[channel]) / (lut.domainMax[channel] - lut.domainMin[channel] || 1));
  const position = normalized * (lut.size - 1);
  const lower = Math.floor(position);
  const upper = Math.min(lut.size - 1, lower + 1);
  const fraction = position - lower;
  const lowerValue = lut.values[lower * 3 + channel];
  const upperValue = lut.values[upper * 3 + channel];

  return lowerValue + (upperValue - lowerValue) * fraction;
}

function sample3d(lut: CubeLut, red: number, green: number, blue: number): [number, number, number] {
  const normalized = [red, green, blue].map((value, channel) =>
    clampUnit((value - lut.domainMin[channel]) / (lut.domainMax[channel] - lut.domainMin[channel] || 1))
  );
  const positions = normalized.map((value) => value * (lut.size - 1));
  const lower = positions.map(Math.floor);
  const upper = lower.map((value) => Math.min(lut.size - 1, value + 1));
  const fractions = positions.map((value, index) => value - lower[index]);
  const output: [number, number, number] = [0, 0, 0];

  for (let redCorner = 0; redCorner <= 1; redCorner += 1) {
    for (let greenCorner = 0; greenCorner <= 1; greenCorner += 1) {
      for (let blueCorner = 0; blueCorner <= 1; blueCorner += 1) {
        const weight = (redCorner ? fractions[0] : 1 - fractions[0])
          * (greenCorner ? fractions[1] : 1 - fractions[1])
          * (blueCorner ? fractions[2] : 1 - fractions[2]);
        const redIndex = redCorner ? upper[0] : lower[0];
        const greenIndex = greenCorner ? upper[1] : lower[1];
        const blueIndex = blueCorner ? upper[2] : lower[2];
        const offset = ((blueIndex * lut.size + greenIndex) * lut.size + redIndex) * 3;

        output[0] += lut.values[offset] * weight;
        output[1] += lut.values[offset + 1] * weight;
        output[2] += lut.values[offset + 2] * weight;
      }
    }
  }

  return output;
}

function lutStage(lut: CubeLut): Stage {
  const is1d = lut.values.length === lut.size * 3;

  return (image) => {
    const data = image.data;

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index] / 255;
      const green = data[index + 1] / 255;
      const blue = data[index + 2] / 255;
      const transformed = is1d
        ? [sample1d(lut, 0, red), sample1d(lut, 1, green), sample1d(lut, 2, blue)]
        : sample3d(lut, red, green, blue);

      data[index] = Math.round(clampUnit(transformed[0]) * 255);
      data[index + 1] = Math.round(clampUnit(transformed[1]) * 255);
      data[index + 2] = Math.round(clampUnit(transformed[2]) * 255);
    }
  };
}

const nodeDefinitions: Record<string, PipelineNodeDefinition> = {
  source: {
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

  selection: {
    async execute(inputs) {
      const photos = inputs.photos as GalleryPhoto[] | undefined;

      if (!photos || photos.length === 0) { return { image: [] } }

      const signal = inputs.signal as AbortSignal;

      const image = await mapWithConcurrency(
        photos,
        inputs.evaluationId as number,
        (photo) => loadUrlImage(composeUrl(photo), photo.title, signal)
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

  invert: stageNode(invertStage),
  "black-white": stageNode(blackAndWhiteStage),
  sepia: stageNode(sepiaStage),

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

  brightness: amountStageNode(brightnessStage, 0),
  highlights: amountStageNode(highlightsStage, 0),
  shadows: amountStageNode(shadowsStage, 0),
  gamma: amountStageNode(gammaStage, 1),
  luminosity: amountStageNode(luminosityStage, 0),
  exposure: amountStageNode(exposureStage, 0),
  contrast: amountStageNode(contrastStage, 0),
  saturation: amountStageNode(saturationStage, 0),
  vibrance: amountStageNode(vibranceStage, 0),
  vignette: amountStageNode(vignetteStage, 0),
  grain: amountStageNode(grainStage, 0),
  sharpen: amountStageNode(sharpenStage, 0),
  pop: amountStageNode(popStage, 0),
  hdr: amountStageNode(hdrEffectStage, 0),
  "hue-rotation": amountStageNode(hueRotationStage, 0),
  fade: amountStageNode(fadeStage, 0),

  "ai-colorizer": createAIImageEditNodeDefinition(
    "ai-colorizer",
    "AI Colorizer",
    AI_COLORIZER_PROMPT
  ),

  "ai-denoiser": createAIImageEditNodeDefinition(
    "ai-denoiser",
    "AI Denoiser",
    AI_DENOISER_PROMPT
  ),

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
        (source) => Promise.resolve(scaleImage(source, scale))
      );

      return { image };
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
  evaluationId: number
): Promise<PipelineViewerImagePayload[]> {
  return mapWithConcurrency(images, evaluationId, async (image) => {
    const [canvas, ctx] = createCanvas(image.width, image.height);

    ctx.drawImage(image.bitmap, 0, 0);

    const blob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: 0.92,
    });

    return {
      blob,
      width: image.width,
      height: image.height,
      name: image.name,
    };
  });
}

// ============================================================
// Pipeline evaluator
// ============================================================

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function runEvaluation(
  message: PipelineEvaluateMessage,
  signal: AbortSignal
): Promise<void> {
  const { evaluationId, nodes, edges } = message;

  const outputs = new Map<string, Promise<NodeOutputs>>();

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

      const inputEntries = await Promise.all(
        incoming.map(async (edge) => {
          const upstream = await evaluateNode(edge.source);

          return [
            edge.targetHandle ?? "input",
            upstream[edge.sourceHandle ?? "output"],
          ] as const;
        })
      );

      const inputs = Object.fromEntries(inputEntries);

      // Special case:
      // Source node gets its Files from node.data.
      if (node.type === "source" || node.type === "hot-folder-read") {
        inputs.files = node.data.files;
      }

      // Special case:
      // Selection node gets its GalleryPhotos from node.data.
      if (node.type === "selection") {
        inputs.photos = node.data.photos;
      }

      if (node.type === "lut") {
        inputs.lutFile = node.data.lutFile;
      }

      // Special case:
      // Slider nodes get their amount from node.data.
      if (SLIDER_NODE_TYPES.has(node.type ?? "")) {
        inputs.amount = node.data.amount;
      }

      // Special case:
      // AI image-edit nodes get their passthru toggle and BYOK key from node.data.
      if (AI_IMAGE_EDIT_NODE_TYPES.has(node.type ?? "")) {
        inputs.passthru = node.data.passthru;
        inputs.apiKey = node.data.apiKey;
        inputs.nodeId = node.id;
      }

      // Special case:
      // Rescale node gets its scale factor from node.data.
      if (node.type === "rescale") {
        inputs.scale = node.data.scale;
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

      // Cancellation plumbing available to every node.
      inputs.evaluationId = evaluationId;
      inputs.signal = signal;

      console.log(`▶ executing ${node.id}`);

      const result = await definition.execute(inputs);

      console.log(`✓ completed ${node.id}`);

      throwIfStale(evaluationId);

      return result;
    })();

    outputs.set(nodeId, promise);

    return promise;
  };

  // Post each viewer's result as soon as it is ready instead of
  // waiting for the whole graph to finish.
  const viewerPosts = nodes
    .filter((node) => VIEWER_NODE_TYPES.has(node.type ?? ""))
    .map((node) =>
      evaluateNode(node.id)
        .then(async (nodeOutputs) => {
          throwIfStale(evaluationId);

          const images = (nodeOutputs.image as WorkerImage[] | undefined) ?? [];
          const payload = await encodeImagesForTransport(images, evaluationId);

          throwIfStale(evaluationId);

          workerScope.postMessage({
            type: "viewer",
            evaluationId,
            nodeId: node.id,
            images: payload,
          });
        })
        .catch((error: unknown) => {
          // Staleness is cancellation, not failure.
          if (!(error instanceof StaleEvaluationError)) {
            console.error(`Viewer node "${node.id}" failed:`, error);
          }
        })
    );

  // Evaluate every node.
  await Promise.all(nodes.map((node) => evaluateNode(node.id)));

  // The transport encode above is async, so without this await the
  // "done" message would overtake the viewer messages; the client
  // resolves still-pending viewers as empty on "done" and the real
  // results would be dropped.
  await Promise.all(viewerPosts);

  throwIfStale(evaluationId);

  workerScope.postMessage({ type: "done", evaluationId });
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
