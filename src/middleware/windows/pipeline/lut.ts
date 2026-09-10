import type { Stage } from "../../interface/adjustments/types";

type Dimension = 1 | 3;

export type CubeLut = {
  size: number;
  dimension: Dimension;
  values: Float32Array;
  domainMin: [number, number, number];
  domainMax: [number, number, number];
};

const SKIPPED_DIRECTIVES = new Set(['TITLE', 'LUT_1D_INPUT_RANGE']);

export function parseCubeLut(text: string): CubeLut {
  let lut1dSize: number | undefined;
  let lut3dSize: number | undefined;
  let domainMin: [number, number, number] = [0, 0, 0];
  let domainMax: [number, number, number] = [1, 1, 1];
  const values: number[] = [];
  let lineNumber = 0;

  for (const rawLine of text.split(/\r?\n/)) {
    lineNumber += 1;
    const line = rawLine.split('#', 1)[0].trim();
    if (!line) continue;

    const parts = line.split(/\s+/);
    const directive = parts[0].toUpperCase();

    if (SKIPPED_DIRECTIVES.has(directive)) continue;

    if (directive === 'LUT_1D_SIZE' || directive === 'LUT_3D_SIZE') {
      const parsedSize = Number(parts[1]);
      if (!Number.isInteger(parsedSize) || parsedSize < 2) {
        throw new Error(`Invalid ${directive} on line ${lineNumber}: "${rawLine.trim()}"`);
      }
      if (directive === 'LUT_1D_SIZE') lut1dSize = parsedSize;
      else lut3dSize = parsedSize;
      continue;
    }

    if (directive === 'DOMAIN_MIN' || directive === 'DOMAIN_MAX') {
      if (parts.length !== 4 || parts.slice(1).some((value) => !Number.isFinite(Number(value)))) {
        throw new Error(`Invalid ${directive} on line ${lineNumber}: "${rawLine.trim()}"`);
      }
      const range: [number, number, number] = [Number(parts[1]), Number(parts[2]), Number(parts[3])];
      if (directive === 'DOMAIN_MIN') domainMin = range;
      else domainMax = range;
      continue;
    }

    if (parts.length !== 3 || parts.some((value) => !Number.isFinite(Number(value)))) {
      throw new Error(`Invalid data row on line ${lineNumber}: "${rawLine.trim()}"`);
    }

    values.push(Number(parts[0]), Number(parts[1]), Number(parts[2]));
  }

  if (lut1dSize !== undefined && lut3dSize !== undefined) {
    throw new Error('A .cube LUT cannot define both LUT_1D_SIZE and LUT_3D_SIZE');
  }

  const size = lut3dSize ?? lut1dSize;
  if (size === undefined) {
    throw new Error('Missing LUT_1D_SIZE or LUT_3D_SIZE in .cube LUT');
  }

  const dimension: Dimension = lut3dSize !== undefined ? 3 : 1;
  const expectedValues = dimension === 3 ? size ** 3 * 3 : size * 3;

  if (values.length !== expectedValues) {
    throw new Error(`Expected ${expectedValues / 3} data rows in .cube LUT, found ${values.length / 3}`);
  }

  for (let channel = 0; channel < 3; channel += 1) {
    if (domainMax[channel] <= domainMin[channel]) {
      throw new Error(`DOMAIN_MAX must be greater than DOMAIN_MIN (channel ${channel})`);
    }
  }

  return { size, dimension, values: new Float32Array(values), domainMin, domainMax };
}

function clampUnit(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/**
 * Builds a per-pixel sampler with everything that doesn't change between
 * pixels (domain scaling, size, strides) precomputed once. The returned
 * function writes into a caller-supplied output tuple so no allocation
 * happens on the hot path — this is called once per pixel.
 */
function createSampler(
  lut: CubeLut
): (r: number, g: number, b: number, out: [number, number, number]) => void {
  const { size, dimension, values, domainMin, domainMax } = lut;
  const maxIndex = size - 1;

  const invRangeR = 1 / (domainMax[0] - domainMin[0]);
  const invRangeG = 1 / (domainMax[1] - domainMin[1]);
  const invRangeB = 1 / (domainMax[2] - domainMin[2]);
  const minR = domainMin[0];
  const minG = domainMin[1];
  const minB = domainMin[2];

  if (dimension === 1) {
    return (r, g, b, out) => {
      const pr = clampUnit((r - minR) * invRangeR) * maxIndex;
      const pg = clampUnit((g - minG) * invRangeG) * maxIndex;
      const pb = clampUnit((b - minB) * invRangeB) * maxIndex;

      const r0 = pr | 0;
      const g0 = pg | 0;
      const b0 = pb | 0;
      const r1 = r0 < maxIndex ? r0 + 1 : r0;
      const g1 = g0 < maxIndex ? g0 + 1 : g0;
      const b1 = b0 < maxIndex ? b0 + 1 : b0;

      const fr = pr - r0;
      const fg = pg - g0;
      const fb = pb - b0;

      out[0] = values[r0 * 3] + (values[r1 * 3] - values[r0 * 3]) * fr;
      out[1] = values[g0 * 3 + 1] + (values[g1 * 3 + 1] - values[g0 * 3 + 1]) * fg;
      out[2] = values[b0 * 3 + 2] + (values[b1 * 3 + 2] - values[b0 * 3 + 2]) * fb;
    };
  }

  const sizeSq = size * size;

  return (r, g, b, out) => {
    const pr = clampUnit((r - minR) * invRangeR) * maxIndex;
    const pg = clampUnit((g - minG) * invRangeG) * maxIndex;
    const pb = clampUnit((b - minB) * invRangeB) * maxIndex;

    const r0 = pr | 0;
    const g0 = pg | 0;
    const b0 = pb | 0;
    const r1 = r0 < maxIndex ? r0 + 1 : r0;
    const g1 = g0 < maxIndex ? g0 + 1 : g0;
    const b1 = b0 < maxIndex ? b0 + 1 : b0;

    const fr = pr - r0;
    const fg = pg - g0;
    const fb = pb - b0;
    const fr0 = 1 - fr;
    const fg0 = 1 - fg;
    const fb0 = 1 - fb;

    // Trilinear interpolation weights for the 8 surrounding cube corners.
    const w000 = fr0 * fg0 * fb0;
    const w100 = fr * fg0 * fb0;
    const w010 = fr0 * fg * fb0;
    const w110 = fr * fg * fb0;
    const w001 = fr0 * fg0 * fb;
    const w101 = fr * fg0 * fb;
    const w011 = fr0 * fg * fb;
    const w111 = fr * fg * fb;

    // .cube data is ordered with red fastest, then green, then blue.
    const o000 = (b0 * sizeSq + g0 * size + r0) * 3;
    const o100 = (b0 * sizeSq + g0 * size + r1) * 3;
    const o010 = (b0 * sizeSq + g1 * size + r0) * 3;
    const o110 = (b0 * sizeSq + g1 * size + r1) * 3;
    const o001 = (b1 * sizeSq + g0 * size + r0) * 3;
    const o101 = (b1 * sizeSq + g0 * size + r1) * 3;
    const o011 = (b1 * sizeSq + g1 * size + r0) * 3;
    const o111 = (b1 * sizeSq + g1 * size + r1) * 3;

    out[0] =
      values[o000] * w000 + values[o100] * w100 + values[o010] * w010 + values[o110] * w110 +
      values[o001] * w001 + values[o101] * w101 + values[o011] * w011 + values[o111] * w111;
    out[1] =
      values[o000 + 1] * w000 + values[o100 + 1] * w100 + values[o010 + 1] * w010 + values[o110 + 1] * w110 +
      values[o001 + 1] * w001 + values[o101 + 1] * w101 + values[o011 + 1] * w011 + values[o111 + 1] * w111;
    out[2] =
      values[o000 + 2] * w000 + values[o100 + 2] * w100 + values[o010 + 2] * w010 + values[o110 + 2] * w110 +
      values[o001 + 2] * w001 + values[o101 + 2] * w101 + values[o011 + 2] * w011 + values[o111 + 2] * w111;
  };
}

export function lutStage(lut: CubeLut): Stage {
  const sample = createSampler(lut);
  const output: [number, number, number] = [0, 0, 0];

  return (image) => {
    const data = image.data;

    for (let index = 0; index < data.length; index += 4) {
      sample(data[index] / 255, data[index + 1] / 255, data[index + 2] / 255, output);

      data[index] = (clampUnit(output[0]) * 255 + 0.5) | 0;
      data[index + 1] = (clampUnit(output[1]) * 255 + 0.5) | 0;
      data[index + 2] = (clampUnit(output[2]) * 255 + 0.5) | 0;
    }
  };
}
