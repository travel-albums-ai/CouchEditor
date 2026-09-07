import { Stage } from '@/middleware/interface/adjustments/types';

export function clamp(v: number) {
  return Math.max(0, Math.min(255, v));
}

export const applyIf = (enabled: boolean, stage: Stage): Stage | null =>
  enabled ? stage : null;

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
      const lum = clamp(0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]);
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

      d[i] = clamp(0.393 * red + 0.769 * green + 0.189 * blue);
      d[i + 1] = clamp(0.349 * red + 0.686 * green + 0.168 * blue);
      d[i + 2] = clamp(0.272 * red + 0.534 * green + 0.131 * blue);
    }
  };
};

export const brightnessStage = (amount: number): Stage => {
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp(d[i] + amount);
      d[i + 1] = clamp(d[i + 1] + amount);
      d[i + 2] = clamp(d[i + 2] + amount);
    }
  };
};

export const highlightsStage = (amount: number): Stage => {
  const strength = amount / 100;

  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const luminance = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      const highlightWeight = luminance * luminance;

      d[i] = clamp(d[i] + (strength >= 0 ? (255 - d[i]) * strength : d[i] * strength) * highlightWeight);
      d[i + 1] = clamp(d[i + 1] + (strength >= 0 ? (255 - d[i + 1]) * strength : d[i + 1] * strength) * highlightWeight);
      d[i + 2] = clamp(d[i + 2] + (strength >= 0 ? (255 - d[i + 2]) * strength : d[i + 2] * strength) * highlightWeight);
    }
  };
};

export const shadowsStage = (amount: number): Stage => {
  const strength = amount / 100;

  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const luminance = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      const shadowWeight = (1 - luminance) * (1 - luminance);

      d[i] = clamp(d[i] + (strength >= 0 ? (255 - d[i]) * strength : d[i] * strength) * shadowWeight);
      d[i + 1] = clamp(d[i + 1] + (strength >= 0 ? (255 - d[i + 1]) * strength : d[i + 1] * strength) * shadowWeight);
      d[i + 2] = clamp(d[i + 2] + (strength >= 0 ? (255 - d[i + 2]) * strength : d[i + 2] * strength) * shadowWeight);
    }
  };
};

export const gammaStage = (gamma: number): Stage => {
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    lut[i] = clamp(Math.round(Math.pow(i / 255, gamma) * 255));
  }
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = lut[d[i]];
      d[i + 1] = lut[d[i + 1]];
      d[i + 2] = lut[d[i + 2]];
    }
  };
};

export const whitesBlacksStage = (whites: number, blacks: number): Stage => {
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp(clamp(d[i] + whites) - blacks);
      d[i + 1] = clamp(clamp(d[i + 1] + whites) - blacks);
      d[i + 2] = clamp(clamp(d[i + 2] + whites) - blacks);
    }
  };
};

export const luminosityStage = (strength: number): Stage => {
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      d[i] = clamp(d[i] + (lum - d[i]) * strength);
      d[i + 1] = clamp(d[i + 1] + (lum - d[i + 1]) * strength);
      d[i + 2] = clamp(d[i + 2] + (lum - d[i + 2]) * strength);
    }
  };
};

export const exposureStage = (exposureEV: number): Stage => {
  const factor = Math.pow(2, exposureEV);

  const lut = new Uint8Array(256);

  for (let i = 0; i < 256; i++) {
    lut[i] = clamp(Math.round(i * factor));
  }

  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = lut[d[i]];
      d[i + 1] = lut[d[i + 1]];
      d[i + 2] = lut[d[i + 2]];
    }
  };
};

export const contrastStage = (amount: number): Stage => {
  const factor = (259 * (amount + 255)) / (255 * (259 - amount));
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp(factor * (d[i] - 128) + 128);
      d[i + 1] = clamp(factor * (d[i + 1] - 128) + 128);
      d[i + 2] = clamp(factor * (d[i + 2] - 128) + 128);
    }
  };
};

export const saturationStage = (amount: number): Stage => {
  const factor = 1 + amount / 100;
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      d[i] = clamp(lum + (d[i] - lum) * factor);
      d[i + 1] = clamp(lum + (d[i + 1] - lum) * factor);
      d[i + 2] = clamp(lum + (d[i + 2] - lum) * factor);
    }
  };
};

export const hueRotationStage = (amount: number): Stage => {
  const rotation = ((amount % 360) + 360) % 360 / 360;

  return (img) => {
    const d = img.data;

    for (let i = 0; i < d.length; i += 4) {
      const red = d[i] / 255;
      const green = d[i + 1] / 255;
      const blue = d[i + 2] / 255;
      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const lightness = (max + min) / 2;

      if (max === min) continue;

      const delta = max - min;
      const saturation = lightness > 0.5
        ? delta / (2 - max - min)
        : delta / (max + min);
      let hue: number;

      if (max === red) {
        hue = (green - blue) / delta + (green < blue ? 6 : 0);
      } else if (max === green) {
        hue = (blue - red) / delta + 2;
      } else {
        hue = (red - green) / delta + 4;
      }

      hue = (hue / 6 + rotation) % 1;
      const q = lightness < 0.5
        ? lightness * (1 + saturation)
        : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;
      const hueToRgb = (t: number) => {
        const wrapped = (t + 1) % 1;
        if (wrapped < 1 / 6) return p + (q - p) * 6 * wrapped;
        if (wrapped < 1 / 2) return q;
        if (wrapped < 2 / 3) return p + (q - p) * (2 / 3 - wrapped) * 6;
        return p;
      };

      d[i] = clamp(hueToRgb(hue + 1 / 3) * 255);
      d[i + 1] = clamp(hueToRgb(hue) * 255);
      d[i + 2] = clamp(hueToRgb(hue - 1 / 3) * 255);
    }
  };
};

export const vibranceStage = (amount: number): Stage => {
  const strength = amount / 100;
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const max = Math.max(r, g, b);
      const avg = (r + g + b) / 3;
      const sat = max === 0 ? 0 : (max - avg) / max;
      const boost = strength * (1 - sat);

      d[i] = clamp(r + (r - avg) * boost);
      d[i + 1] = clamp(g + (g - avg) * boost);
      d[i + 2] = clamp(b + (b - avg) * boost);
    }
  };
};

export const temperatureTintStage = (temp: number, tint: number): Stage => {
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp(d[i] + temp * 0.6 + tint * 0.15);
      d[i + 1] = clamp(d[i + 1] + tint * 0.5);
      d[i + 2] = clamp(d[i + 2] - temp * 0.6 + tint * 0.15);
    }
  };
};

type RGB = { r: number; g: number; b: number };

export const splitToningStage = (
  // shadowColor: RGB,
  shadowTintR: number,
  shadowTintG: number,
  shadowTintB: number,
  highlightTintR: number,
  highlightTintG: number,
  highlightTintB: number,
  // highlightColor: RGB,
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

export const fadeStage = (amount: number): Stage => {
  const strength = amount / 100;
  const lift = 28 * strength;
  const squeeze = 1 - 0.3 * strength;
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = clamp(d[i] * squeeze + lift);
      d[i + 1] = clamp(d[i + 1] * squeeze + lift);
      d[i + 2] = clamp(d[i + 2] * squeeze + lift);
    }
  };
};

export const vignetteStage = (amount: number): Stage => {
  const strength = amount / 100;
  return (img) => {
    if (strength <= 0) return;
    const { width, height, data } = img;
    const cx = width / 2;
    const cy = height / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
        const falloff = 1 - strength * Math.pow(dist, 2.2);
        const idx = (y * width + x) * 4;

        data[idx] = clamp(data[idx] * falloff);
        data[idx + 1] = clamp(data[idx + 1] * falloff);
        data[idx + 2] = clamp(data[idx + 2] * falloff);
      }
    }
  };
};

export const grainStage = (amount: number): Stage => {
  const strength = amount / 100;
  return (img) => {
    if (strength <= 0) return;
    const d = img.data;
    const scale = strength * 35;

    for (let i = 0; i < d.length; i += 4) {
      const noise = (Math.random() - 0.5) * scale;
      d[i] = clamp(d[i] + noise);
      d[i + 1] = clamp(d[i + 1] + noise);
      d[i + 2] = clamp(d[i + 2] + noise);
    }
  };
};

export const sharpenStage = (amount: number): Stage => {
  const strength = amount / 100;
  return (img) => {
    if (strength <= 0) return;
    const { width, height, data } = img;
    const src = new Uint8ClampedArray(data);

    const kernelCenter = 1 + 4 * strength;
    const kernelEdge = -strength;

    const sample = (x: number, y: number, c: number) => {
      const cx = Math.min(width - 1, Math.max(0, x));
      const cy = Math.min(height - 1, Math.max(0, y));
      return src[(cy * width + cx) * 4 + c];
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        for (let c = 0; c < 3; c++) {
          const center = sample(x, y, c) * kernelCenter;
          const neighbors =
            (sample(x - 1, y, c) + sample(x + 1, y, c) + sample(x, y - 1, c) + sample(x, y + 1, c)) *
            kernelEdge;
          data[idx + c] = clamp(center + neighbors);
        }
      }
    }
  };
};

export const removeFilmBaseStage = (
  base: RGB,
  strength: MaskStrength = { r: 1, g: 1, b: 1 }
): Stage => {
  const r0 = Math.max(1, base.r * strength.r);
  const g0 = Math.max(1, base.g * strength.g);
  const b0 = Math.max(1, base.b * strength.b);

  return (img) => {
    const d = img.data;

    for (let i = 0; i < d.length; i += 4) {
      d[i]     = clamp((d[i]     / r0) * 255);
      d[i + 1] = clamp((d[i + 1] / g0) * 255);
      d[i + 2] = clamp((d[i + 2] / b0) * 255);
    }
  };
};

export const perChannelGammaStage = (gr: number, gg: number, gb: number): Stage => {
  const lut = (g: number) => {
    const t = new Uint8Array(256);
    for (let i = 0; i < 256; i++) t[i] = Math.pow(i / 255, g) * 255;
    return t;
  };
  const lr = lut(gr), lg = lut(gg), lb = lut(gb);
  return (img) => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = lr[d[i]]; d[i + 1] = lg[d[i + 1]]; d[i + 2] = lb[d[i + 2]];
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

export const popStage = (amount: number): Stage => {
  const strength = amount / 100;
  const contrastFactor = 1 + 0.5 * strength;
  const saturationFactor = 1 + 0.6 * strength;

  return (img) => {
    if (strength <= 0) return;
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      let r = clamp(contrastFactor * (d[i] - 128) + 128);
      let g = clamp(contrastFactor * (d[i + 1] - 128) + 128);
      let b = clamp(contrastFactor * (d[i + 2] - 128) + 128);

      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = clamp(lum + (r - lum) * saturationFactor);
      g = clamp(lum + (g - lum) * saturationFactor);
      b = clamp(lum + (b - lum) * saturationFactor);

      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
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

export const hdrEffectStage = (amount: number, radius = 12): Stage => {
  const strength = amount / 100;

  return (img) => {
    if (strength <= 0) return;
    const { width, height, data } = img;
    const src = new Uint8ClampedArray(data);

    const lum = new Float32Array(width * height);
    for (let i = 0, p = 0; i < src.length; i += 4, p++) {
      lum[p] = 0.2126 * src[i] + 0.7152 * src[i + 1] + 0.0722 * src[i + 2];
    }

    const blurred = boxBlur1D(lum, width, height, radius);

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const detail = lum[p] - blurred[p];
      const boost = detail * strength * 1.5;
      data[i] = clamp(src[i] + boost);
      data[i + 1] = clamp(src[i + 1] + boost);
      data[i + 2] = clamp(src[i + 2] + boost);
    }
  };
};
