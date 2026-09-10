import type { Stage } from "../../interface/adjustments/types";

export type CubeLut = {
  size: number;
  values: Float32Array;
  domainMin: [number, number, number];
  domainMax: [number, number, number];
};

export function parseCubeLut(text: string): CubeLut {
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

export function lutStage(lut: CubeLut): Stage {
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
