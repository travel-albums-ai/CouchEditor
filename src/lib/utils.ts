import { Stage } from '@/middleware/interface/adjustments/types';

const LUM_R = 0.2126, LUM_G = 0.7152, LUM_B = 0.0722;
const INV_255_SQ = 1 / (255 * 255);
type RGB = { r: number; g: number; b: number };

export function clamp(v: number) {
  return Math.max(0, Math.min(255, v));
}

function hueToRgb(p: number, q: number, t: number): number {
  const wrapped = (t + 1) % 1;
  if (wrapped < 1 / 6) return p + (q - p) * 6 * wrapped;
  if (wrapped < 1 / 2) return q;
  if (wrapped < 2 / 3) return p + (q - p) * (2 / 3 - wrapped) * 6;
  return p;
}

export const invertStage = (): Stage => {
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = 255 - d[i];
      d[i + 1] = 255 - d[i + 1];
      d[i + 2] = 255 - d[i + 2];
    }
  };
};

export const blackAndWhiteStage = (): Stage => {
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      d[i] = lum;
      d[i + 1] = lum;
      d[i + 2] = lum;
    }
  };
};

export const sepiaStage = (): Stage => {
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const red = d[i];
      const green = d[i + 1];
      const blue = d[i + 2];
      d[i] = 0.393 * red + 0.769 * green + 0.189 * blue;
      d[i + 1] = 0.349 * red + 0.686 * green + 0.168 * blue;
      d[i + 2] = 0.272 * red + 0.534 * green + 0.131 * blue;
    }
  };
};

export const brightnessStage = (amount: number): Stage => {
  const lut = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v++) lut[v] = v + amount; // clamps/rounds on write

  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = lut[d[i]];
      d[i + 1] = lut[d[i + 1]];
      d[i + 2] = lut[d[i + 2]];
    }
  };
};

export const highlightsStage = (amount: number): Stage => {
  const strength = amount / 100;

  return (img) => {
    const d = img.data;
    const len = d.length;

    if (strength >= 0) {
      for (let i = 0; i < len; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const rawLum = LUM_R * r + LUM_G * g + LUM_B * b;
        const w = rawLum * rawLum * INV_255_SQ * strength;
        d[i] = r + (255 - r) * w;
        d[i + 1] = g + (255 - g) * w;
        d[i + 2] = b + (255 - b) * w;
      }
    } else {
      for (let i = 0; i < len; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const rawLum = LUM_R * r + LUM_G * g + LUM_B * b;
        const w = rawLum * rawLum * INV_255_SQ * strength;
        d[i] = r + r * w;
        d[i + 1] = g + g * w;
        d[i + 2] = b + b * w;
      }
    }
  };
};

export const shadowsStage = (amount: number): Stage => {
  const strength = amount / 100;

  return (img) => {
    const d = img.data;
    const len = d.length;

    if (strength >= 0) {
      for (let i = 0; i < len; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const inv = 255 - (LUM_R * r + LUM_G * g + LUM_B * b);
        const w = inv * inv * INV_255_SQ * strength;
        d[i] = r + (255 - r) * w;
        d[i + 1] = g + (255 - g) * w;
        d[i + 2] = b + (255 - b) * w;
      }
    } else {
      for (let i = 0; i < len; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const inv = 255 - (LUM_R * r + LUM_G * g + LUM_B * b);
        const w = inv * inv * INV_255_SQ * strength;
        d[i] = r + r * w;
        d[i + 1] = g + g * w;
        d[i + 2] = b + b * w;
      }
    }
  };
};

export const gammaStage = (gamma: number): Stage => {
  const lut = new Uint8ClampedArray(256); // auto rounds/clamps on write
  for (let i = 0; i < 256; i++) {
    lut[i] = Math.pow(i / 255, gamma) * 255;
  }
  return (img) => {
    const d = img.data;
    const len = d.length;
    for (let i = 0; i < len; i += 4) {
      d[i] = lut[d[i]];
      d[i + 1] = lut[d[i + 1]];
      d[i + 2] = lut[d[i + 2]];
    }
  };
};

export const luminosityStage = (strength: number): Stage => {
  const inv = 1 - strength;
  return (img) => {
    const d = img.data;
    const len = d.length;
    for (let i = 0; i < len; i += 4) {
      const lum = LUM_R * d[i] + LUM_G * d[i + 1] + LUM_B * d[i + 2];
      d[i] = d[i] * inv + lum * strength;
      d[i + 1] = d[i + 1] * inv + lum * strength;
      d[i + 2] = d[i + 2] * inv + lum * strength;
    }
  };
};

export const exposureStage = (exposureEV: number): Stage => {
  const factor = Math.pow(2, exposureEV);
  const lut = new Uint8ClampedArray(256); // clamps/rounds on write
  for (let i = 0; i < 256; i++) lut[i] = i * factor;

  return (img) => {
    const d = img.data;
    const len = d.length;
    for (let i = 0; i < len; i += 4) {
      d[i] = lut[d[i]];
      d[i + 1] = lut[d[i + 1]];
      d[i + 2] = lut[d[i + 2]];
    }
  };
};

export const contrastStage = (amount: number): Stage => {
  const factor = (259 * (amount + 255)) / (255 * (259 - amount));
  const lut = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++) lut[i] = factor * (i - 128) + 128;

  return (img) => {
    const d = img.data;
    const len = d.length;
    for (let i = 0; i < len; i += 4) {
      d[i] = lut[d[i]];
      d[i + 1] = lut[d[i + 1]];
      d[i + 2] = lut[d[i + 2]];
    }
  };
};

export const saturationStage = (amount: number): Stage => {
  const factor = 1 + amount / 100;
  const invFactor = 1 - factor;

  return (img) => {
    const d = img.data;
    const len = d.length;
    for (let i = 0; i < len; i += 4) {
      const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      const lumTerm = lum * invFactor; // shared across all 3 channels
      d[i] = d[i] * factor + lumTerm;
      d[i + 1] = d[i + 1] * factor + lumTerm;
      d[i + 2] = d[i + 2] * factor + lumTerm;
    }
  };
};

export const hueRotationStage = (amount: number): Stage => {
  const rotation = (((amount % 360) + 360) % 360) / 360;

  return (img) => {
    const d = img.data;
    const len = d.length;

    for (let i = 0; i < len; i += 4) {
      const red = d[i] / 255;
      const green = d[i + 1] / 255;
      const blue = d[i + 2] / 255;
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);

      if (max === min) continue; // gray pixel, hue is undefined — skip

      const lightness = (max + min) / 2;
      const delta = max - min;
      const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

      let hue: number;
      if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
      else if (max === green) hue = (blue - red) / delta + 2;
      else hue = (red - green) / delta + 4;

      hue = (hue / 6 + rotation) % 1;
      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;

      d[i] = hueToRgb(p, q, hue + 1 / 3) * 255;
      d[i + 1] = hueToRgb(p, q, hue) * 255;
      d[i + 2] = hueToRgb(p, q, hue - 1 / 3) * 255;
    }
  };
};

///

export const vibranceStage = (amount: number): Stage => {
  const strength = amount / 100;
  const ONE_THIRD = 1 / 3;
  return (img) => {
    const d = img.data;
    const len = d.length;
    for (let i = 0; i < len; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const max = Math.max(r, g, b);
      const avg = (r + g + b) * ONE_THIRD;
      const sat = max === 0 ? 0 : (max - avg) / max;
      const boost = strength * (1 - sat);

      d[i] = r + (r - avg) * boost;
      d[i + 1] = g + (g - avg) * boost;
      d[i + 2] = b + (b - avg) * boost;
    }
  };
};

export const fadeStage = (amount: number): Stage => {
  const strength = amount / 100;
  const lift = 28 * strength;
  const squeeze = 1 - 0.3 * strength;
  const lut = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++) lut[i] = i * squeeze + lift;

  return (img) => {
    const d = img.data;
    const len = d.length;
    for (let i = 0; i < len; i += 4) {
      d[i] = lut[d[i]];
      d[i + 1] = lut[d[i + 1]];
      d[i + 2] = lut[d[i + 2]];
    }
  };
};

export const vignetteStage = (
  amount: number,
  color: [number, number, number] = [0, 0, 0]
): Stage => {
  const strength = amount / 100;
  return (img) => {
    if (strength <= 0) return;
    const { width, height, data } = img;
    const cx = width / 2;
    const cy = height / 2;
    const maxDistSq = cx * cx + cy * cy;
    // dist^2.2 = sqrt(distSq)^2.2 = distSq^1.1 — skips the sqrt entirely
    const invMaxDistPow = 1 / Math.pow(maxDistSq, 1.1);

    const dx2 = new Float64Array(width);
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      dx2[x] = dx * dx;
    }

    for (let y = 0; y < height; y++) {
      const dy = y - cy;
      const dy2 = dy * dy;
      const rowOffset = y * width;
      for (let x = 0; x < width; x++) {
        const falloff = 1 - strength * Math.pow(dx2[x] + dy2, 1.1) * invMaxDistPow;
        const idx = (rowOffset + x) * 4;
        const tint = 1 - falloff;
        data[idx] = data[idx] * falloff + color[0] * tint;
        data[idx + 1] = data[idx + 1] * falloff + color[1] * tint;
        data[idx + 2] = data[idx + 2] * falloff + color[2] * tint;
      }
    }
  };
};

export const grainStage = (amount: number): Stage => {
  const strength = amount / 100;
  return (img) => {
    if (strength <= 0) return;
    const d = img.data;
    const len = d.length;
    const scale = strength * 35;

    for (let i = 0; i < len; i += 4) {
      const noise = (Math.random() - 0.5) * scale;
      d[i] += noise;
      d[i + 1] += noise;
      d[i + 2] += noise;
    }
  };
};

export const sharpenStage = (amount: number): Stage => {
  const strength = amount / 100;
  return (img) => {
    if (strength <= 0) return;
    const { width, height, data } = img;
    const src = new Uint8ClampedArray(data);
    const center = 1 + 4 * strength;
    const edge = -strength;

    // Interior: direct indexing, no bounds checks
    for (let y = 1; y < height - 1; y++) {
      const row = y * width;
      const rowAbove = row - width;
      const rowBelow = row + width;
      for (let x = 1; x < width - 1; x++) {
        const idx = (row + x) * 4;
        const idxUp = (rowAbove + x) * 4;
        const idxDown = (rowBelow + x) * 4;
        for (let c = 0; c < 3; c++) {
          data[idx + c] =
            src[idx + c] * center +
            (src[idx - 4 + c] + src[idx + 4 + c] + src[idxUp + c] + src[idxDown + c]) * edge;
        }
      }
    }

    // Border: 1px ring only — bounds-checked sampling
    const clampX = (x: number) => (x < 0 ? 0 : x >= width ? width - 1 : x);
    const clampY = (y: number) => (y < 0 ? 0 : y >= height ? height - 1 : y);
    const sampleClamped = (x: number, y: number, c: number) =>
      src[(clampY(y) * width + clampX(x)) * 4 + c];

    const writeBorderPixel = (x: number, y: number) => {
      const idx = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        data[idx + c] =
          sampleClamped(x, y, c) * center +
          (sampleClamped(x - 1, y, c) + sampleClamped(x + 1, y, c) +
           sampleClamped(x, y - 1, c) + sampleClamped(x, y + 1, c)) * edge;
      }
    };

    for (let x = 0; x < width; x++) {
      writeBorderPixel(x, 0);
      writeBorderPixel(x, height - 1);
    }
    for (let y = 1; y < height - 1; y++) {
      writeBorderPixel(0, y);
      writeBorderPixel(width - 1, y);
    }
  };
};

export const hdrEffectStage = (amount: number, radius = 12): Stage => {
  const strength = amount / 100;
  const boostScale = strength * 1.5;

  return (img) => {
    if (strength <= 0) return;
    const { width, height, data } = img;
    const len = data.length;
    const pixelCount = width * height;

    const lum = new Float32Array(pixelCount);
    for (let i = 0, p = 0; i < len; i += 4, p++) {
      lum[p] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    }

    const blurred = boxBlur1D(lum, width, height, radius);

    for (let i = 0, p = 0; i < len; i += 4, p++) {
      const boost = (lum[p] - blurred[p]) * boostScale;
      data[i] = clamp(data[i] + boost);
      data[i + 1] = clamp(data[i + 1] + boost);
      data[i + 2] = clamp(data[i + 2] + boost);
    }
  };
};

export const popStage = (amount: number): Stage => {
  const strength = amount / 100;
  const contrastFactor = 1 + 0.5 * strength;
  const saturationFactor = 1 + 0.6 * strength;

  const contrastLUT = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v++) {
    contrastLUT[v] = clamp(contrastFactor * (v - 128) + 128);
  }

  return (img) => {
    if (strength <= 0) return;
    const d = img.data;
    const len = d.length;
    for (let i = 0; i < len; i += 4) {
      const r = contrastLUT[d[i]];
      const g = contrastLUT[d[i + 1]];
      const b = contrastLUT[d[i + 2]];

      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      d[i] = clamp(lum + (r - lum) * saturationFactor);
      d[i + 1] = clamp(lum + (g - lum) * saturationFactor);
      d[i + 2] = clamp(lum + (b - lum) * saturationFactor);
    }
  };
};

export const whitesBlacksStage = (whites: number, blacks: number): Stage => {
  if (whites === 0 && blacks === 0) {
    return () => {};
  }

  const lut = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v++) {
    lut[v] = clamp(clamp(v + whites) - blacks);
  }

  return (img) => {
    const d = img.data;
    const len = d.length;
    for (let i = 0; i < len; i += 4) {
      d[i] = lut[d[i]];
      d[i + 1] = lut[d[i + 1]];
      d[i + 2] = lut[d[i + 2]];
    }
  };
};

export const temperatureTintStage = (temp: number, tint: number): Stage => {
  if (temp === 0 && tint === 0) {
    return () => {};
  }

  const rOffset = temp * 0.6 + tint * 0.15;
  const gOffset = tint * 0.5;
  const bOffset = -temp * 0.6 + tint * 0.15;

  const rLUT = new Uint8ClampedArray(256);
  const gLUT = new Uint8ClampedArray(256);
  const bLUT = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v++) {
    rLUT[v] = clamp(v + rOffset);
    gLUT[v] = clamp(v + gOffset);
    bLUT[v] = clamp(v + bOffset);
  }

  return (img) => {
    const d = img.data;
    const len = d.length;
    for (let i = 0; i < len; i += 4) {
      d[i] = rLUT[d[i]];
      d[i + 1] = gLUT[d[i + 1]];
      d[i + 2] = bLUT[d[i + 2]];
    }
  };
};

// Verified with AI

export const splitToningStage = (
  shadowTintR: number,
  shadowTintG: number,
  shadowTintB: number,
  highlightTintR: number,
  highlightTintG: number,
  highlightTintB: number,
  strength: number
): Stage => {
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      const shadowWeight = (1 - lum) * strength;
      const highlightWeight = lum * strength;

      d[i] = clamp(
        d[i] + (shadowTintR - 128) * shadowWeight + (highlightTintR - 128) * highlightWeight
      );
      d[i + 1] = clamp(
        d[i + 1] + (shadowTintG - 128) * shadowWeight + (highlightTintG - 128) * highlightWeight
      );
      d[i + 2] = clamp(
        d[i + 2] + (shadowTintB - 128) * shadowWeight + (highlightTintB - 128) * highlightWeight
      );
    }
  };
};

export const rgbBlackPointStage = (
  blackR: number,
  blackG: number,
  blackB: number,
): Stage => {
  const lutR = new Uint8Array(256);
  const lutG = new Uint8Array(256);
  const lutB = new Uint8Array(256);

  for (let i = 0; i < 256; i++) {
    const denomR = Math.max(1, 255 - blackR);
    const denomG = Math.max(1, 255 - blackG);
    const denomB = Math.max(1, 255 - blackB);
    lutR[i] = clamp(Math.round(((i - blackR) * 255) / denomR));
    lutG[i] = clamp(Math.round(((i - blackG) * 255) / denomG));
    lutB[i] = clamp(Math.round(((i - blackB) * 255) / denomB));
  }

  return (img) => {
    const d = img.data;

    for (let i = 0; i < d.length; i += 4) {
      d[i] = lutR[d[i]];
      d[i + 1] = lutG[d[i + 1]];
      d[i + 2] = lutB[d[i + 2]];
    }
  };
};

export const rgbWhitePointStage = (
  whiteR: number,
  whiteG: number,
  whiteB: number,
): Stage => {
  const lutR = new Uint8Array(256);
  const lutG = new Uint8Array(256);
  const lutB = new Uint8Array(256);

  // Prevent divide-by-zero
  whiteR = Math.max(1, whiteR);
  whiteG = Math.max(1, whiteG);
  whiteB = Math.max(1, whiteB);

  for (let i = 0; i < 256; i++) {
    lutR[i] = clamp(Math.round((i * 255) / whiteR));
    lutG[i] = clamp(Math.round((i * 255) / whiteG));
    lutB[i] = clamp(Math.round((i * 255) / whiteB));
  }

  return (img) => {
    const d = img.data;

    for (let i = 0; i < d.length; i += 4) {
      d[i] = lutR[d[i]];
      d[i + 1] = lutG[d[i + 1]];
      d[i + 2] = lutB[d[i + 2]];
    }
  };
};

export const rgbMidtonesStage = (
  gammaR: number,
  gammaG: number,
  gammaB: number,
): Stage => {
  const lutR = new Uint8Array(256);
  const lutG = new Uint8Array(256);
  const lutB = new Uint8Array(256);

  for (let i = 0; i < 256; i++) {
    const x = i / 255;

    lutR[i] = clamp(Math.round(Math.pow(x, gammaR) * 255));
    lutG[i] = clamp(Math.round(Math.pow(x, gammaG) * 255));
    lutB[i] = clamp(Math.round(Math.pow(x, gammaB) * 255));
  }

  return (img) => {
    const d = img.data;

    for (let i = 0; i < d.length; i += 4) {
      d[i] = lutR[d[i]];
      d[i + 1] = lutG[d[i + 1]];
      d[i + 2] = lutB[d[i + 2]];
    }
  };
};


function boxBlur1D(src: Float32Array, width: number, height: number, radius: number): Float32Array {
  const tmp = new Float32Array(width * height);
  const out = new Float32Array(width * height);
  const cx = (x: number) => Math.min(width - 1, Math.max(0, x));
  const cy = (y: number) => Math.min(height - 1, Math.max(0, y));
  const norm = 1 / (radius * 2 + 1);

  // horizontal pass
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let k = -radius; k <= radius; k++) sum += src[y * width + cx(k)];
    for (let x = 0; x < width; x++) {
      tmp[y * width + x] = sum * norm;
      sum += src[y * width + cx(x + radius + 1)] - src[y * width + cx(x - radius)];
    }
  }

  // vertical pass
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let k = -radius; k <= radius; k++) sum += tmp[cy(k) * width + x];
    for (let y = 0; y < height; y++) {
      out[y * width + x] = sum * norm;
      sum += tmp[cy(y + radius + 1) * width + x] - tmp[cy(y - radius) * width + x];
    }
  }

  return out;
}
