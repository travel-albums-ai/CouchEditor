// ---------------------------------------------------------------------------
// Per-operation parameter contracts
// ---------------------------------------------------------------------------
// Every operation now has a fixed-shape params tuple instead of a bare
// `number[]`. Passing the wrong count/order of params for an operation is a
// TypeScript error at the call site instead of a silent `uParams[n]` read of
// zero/garbage inside the shader.

type OperationParamsMap = {
  invert: [];
  "black-white": [];
  sepia: [];
  brightness: [amount: number];
  highlights: [amount: number];
  shadows: [amount: number];
  gamma: [amount: number];
  luminosity: [amount: number];
  exposure: [amount: number];
  contrast: [amount: number];
  saturation: [amount: number];
  vibrance: [amount: number];
  fade: [amount: number];
  vignette: [amount: number, r: number, g: number, b: number];
  grain: [amount: number];
  sharpen: [amount: number];
  pop: [amount: number];
  hdr: [amount: number, radius: number];
  "whites-blacks": [whites: number, blacks: number];
  "temperature-tint": [temperature: number, tint: number];
  "split-toning": [
    shadowR: number,
    shadowG: number,
    shadowB: number,
    highlightR: number,
    highlightG: number,
    highlightB: number,
    balance: number,
  ];
  "rgb-black-point": [r: number, g: number, b: number];
  "rgb-white-point": [r: number, g: number, b: number];
  "rgb-midtones": [r: number, g: number, b: number];
  "hue-rotation": [degrees: number];
};

export type GpuOperation = {
  [K in keyof OperationParamsMap]: {
    kind: K;
    params: OperationParamsMap[K];
  };
}[keyof OperationParamsMap];

// ---------------------------------------------------------------------------
// Operation IDs — single source of truth
// ---------------------------------------------------------------------------
// These numeric values are UNCHANGED from the original file on purpose: if
// they're ever persisted (saved presets, serialized pipelines) renumbering
// would silently corrupt existing data. I haven't seen the PRESETS/storage
// code, so I'm treating that as a real risk rather than assuming it's safe.
//
// The `satisfies` clause guarantees every GpuOperation["kind"] has an ID and
// every ID maps to a real kind — add a new operation to OperationParamsMap
// without adding it here and TS will fail the build instead of the shader
// silently no-op'ing on an unmapped kind.
export const gpuOperationIds = {
  invert: 1,
  "black-white": 2,
  sepia: 3,
  brightness: 4,
  highlights: 5,
  shadows: 6,
  gamma: 7,
  luminosity: 8,
  exposure: 9,
  contrast: 10,
  saturation: 11,
  vibrance: 12,
  fade: 13,
  vignette: 14,
  grain: 15,
  pop: 16,
  "whites-blacks": 17,
  "temperature-tint": 18,
  "split-toning": 19,
  "rgb-black-point": 20,
  "rgb-white-point": 21,
  "rgb-midtones": 22,
  sharpen: 23,
  hdr: 24,
  "hue-rotation": 25,
} as const satisfies Record<GpuOperation["kind"], number>;

function toDefineName(kind: string): string {
  return `OP_${kind.toUpperCase().replace(/-/g, "_")}`;
}

// GLSL #define block generated straight from gpuOperationIds. This is the
// fix for the biggest maintenance hazard in the original file: the TS map
// and the shader's branch conditions were maintained by hand in two places
// with nothing checking they agreed. Now there is exactly one place that
// knows the numbers.
const glslOperationDefines = Object.entries(gpuOperationIds)
  .map(([kind, id]) => `#define ${toDefineName(kind)} ${id}`)
  .join("\n");

export const gpuVertexShader = `#version 300 es
in vec2 aPosition;
in vec2 aTexCoord;
out vec2 vTexCoord;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = vec2(aTexCoord.x, 1.0 - aTexCoord.y);
}`;

export const gpuFragmentShader = `#version 300 es
precision highp float;
${glslOperationDefines}

uniform sampler2D uImage;
uniform int uOperation;
uniform float uParams[8];
uniform vec2 uResolution;
in vec2 vTexCoord;
out vec4 outColor;

const float LUM_R = 0.2126;
const float LUM_G = 0.7152;
const float LUM_B = 0.0722;

float lum(vec3 color) {
  return dot(color, vec3(LUM_R, LUM_G, LUM_B));
}

float hueToRgb(float p, float q, float t) {
  t = fract(t);
  if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
  if (t < 1.0 / 2.0) return q;
  if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
  return p;
}

float randomNoise(vec2 coordinate) {
  return fract(sin(dot(coordinate, vec2(12.9898, 78.233))) * 43758.5453);
}

// Unchanged on purpose: a matrix/YIQ-style hue rotation would be cheaper,
// but produces a visibly different result than true HSL hue rotation.
// If saved film-stock presets bake in this operation, swapping the
// algorithm would change how existing presets render. Flagging as a
// possible future optimization rather than applying it silently.
vec3 applyHslRotation(vec3 color, float rotation) {
  float maxColor = max(color.r, max(color.g, color.b));
  float minColor = min(color.r, min(color.g, color.b));
  if (maxColor == minColor) return color;

  float lightness = (maxColor + minColor) * 0.5;
  float delta = maxColor - minColor;
  float saturation = lightness > 0.5
    ? delta / (2.0 - maxColor - minColor)
    : delta / (maxColor + minColor);
  float hue;
  if (maxColor == color.r) hue = (color.g - color.b) / delta + (color.g < color.b ? 6.0 : 0.0);
  else if (maxColor == color.g) hue = (color.b - color.r) / delta + 2.0;
  else hue = (color.r - color.g) / delta + 4.0;
  hue = fract(hue / 6.0 + rotation);
  float q = lightness < 0.5
    ? lightness * (1.0 + saturation)
    : lightness + saturation - lightness * saturation;
  float p = 2.0 * lightness - q;
  return vec3(
    hueToRgb(p, q, hue + 1.0 / 3.0),
    hueToRgb(p, q, hue),
    hueToRgb(p, q, hue - 1.0 / 3.0)
  );
}

vec3 sampleClamped(ivec2 coordinate) {
  ivec2 size = ivec2(uResolution);
  return texelFetch(uImage, clamp(coordinate, ivec2(0), size - 1), 0).rgb;
}

// Shared by the three "levels" operations below — same math as before,
// just factored out so the three branches aren't hand-duplicating the
// per-channel formula.
vec3 applyBlackPoint(vec3 rgb, vec3 point) {
  return (rgb * 255.0 - point) / max(vec3(1.0), vec3(255.0) - point) / 255.0;
}

vec3 applyWhitePoint(vec3 rgb, vec3 point) {
  return rgb * 255.0 / max(vec3(1.0), point);
}

vec3 applyMidtoneGamma(vec3 rgb, vec3 gammaVec) {
  return pow(max(rgb, vec3(0.0)), gammaVec);
}

void main() {
  // NOTE: switched the base sample to texelFetch for pixel-address
  // consistency with sampleClamped (used by sharpen/hdr below), which
  // already assumes 1:1 texture-to-output mapping via gl_FragCoord. If
  // that assumption doesn't hold everywhere this shader is used (e.g. a
  // downscaled live-preview pass), this and the original code would both
  // need a different approach — I haven't seen the renderer/pipeline code
  // that calls this shader, so flagging rather than assuming.
  ivec2 texel = ivec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec4 color = vec4(sampleClamped(texel), texture(uImage, vTexCoord).a);
  vec3 rgb = color.rgb;
  float amount = uParams[0];

  switch (uOperation) {
    case OP_INVERT: {
      rgb = 1.0 - rgb;
      break;
    }
    case OP_BLACK_WHITE: {
      rgb = vec3(lum(rgb));
      break;
    }
    case OP_SEPIA: {
      rgb = vec3(
        dot(rgb, vec3(0.393, 0.769, 0.189)),
        dot(rgb, vec3(0.349, 0.686, 0.168)),
        dot(rgb, vec3(0.272, 0.534, 0.131))
      );
      break;
    }
    case OP_BRIGHTNESS: {
      rgb += amount / 255.0;
      break;
    }
    case OP_HIGHLIGHTS:
    case OP_SHADOWS: {
      float weight = uOperation == OP_HIGHLIGHTS ? lum(rgb) : 1.0 - lum(rgb);
      weight *= weight * amount;
      rgb = amount >= 0.0
        ? mix(rgb, vec3(1.0), weight)
        : rgb + rgb * weight;
      break;
    }
    case OP_GAMMA: {
      rgb = pow(max(rgb, vec3(0.0)), vec3(amount));
      break;
    }
    case OP_LUMINOSITY: {
      rgb = mix(rgb, vec3(lum(rgb)), amount);
      break;
    }
    case OP_EXPOSURE: {
      rgb *= pow(2.0, amount);
      break;
    }
    case OP_CONTRAST: {
      float factor = (259.0 * (amount + 255.0)) / (255.0 * (259.0 - amount));
      rgb = factor * (rgb - vec3(128.0 / 255.0)) + vec3(128.0 / 255.0);
      break;
    }
    case OP_SATURATION: {
      float factor = 1.0 + amount / 100.0;
      rgb = vec3(lum(rgb)) + (rgb - vec3(lum(rgb))) * factor;
      break;
    }
    case OP_VIBRANCE: {
      float strength = amount / 100.0;
      float maxColor = max(rgb.r, max(rgb.g, rgb.b));
      float average = (rgb.r + rgb.g + rgb.b) / 3.0;
      float saturation = maxColor == 0.0 ? 0.0 : (maxColor - average) / maxColor;
      rgb += (rgb - vec3(average)) * (strength * (1.0 - saturation));
      break;
    }
    case OP_FADE: {
      float strength = amount / 100.0;
      rgb = rgb * (1.0 - 0.3 * strength) + vec3(28.0 / 255.0 * strength);
      break;
    }
    case OP_VIGNETTE: {
      float strength = amount / 100.0;
      if (strength > 0.0) {
        vec2 centered = (gl_FragCoord.xy - uResolution * 0.5);
        float maxDistance = dot(uResolution * 0.5, uResolution * 0.5);
        float falloff = 1.0 - strength * pow(dot(centered, centered), 1.1) / pow(maxDistance, 1.1);
        rgb = mix(vec3(uParams[1], uParams[2], uParams[3]), rgb, falloff);
      }
      break;
    }
    case OP_GRAIN: {
      if (amount > 0.0) {
        float noise = (randomNoise(gl_FragCoord.xy) - 0.5) * (amount / 100.0 * 35.0) / 255.0;
        rgb += vec3(noise);
      }
      break;
    }
    case OP_POP: {
      if (amount > 0.0) {
        float strength = amount / 100.0;
        float contrastFactor = 1.0 + 0.5 * strength;
        float saturationFactor = 1.0 + 0.6 * strength;
        rgb = contrastFactor * (rgb - vec3(128.0 / 255.0)) + vec3(128.0 / 255.0);
        rgb = vec3(lum(rgb)) + (rgb - vec3(lum(rgb))) * saturationFactor;
      }
      break;
    }
    case OP_WHITES_BLACKS: {
      rgb = clamp(rgb + vec3(amount / 255.0), 0.0, 1.0);
      rgb = clamp(rgb - vec3(uParams[1] / 255.0), 0.0, 1.0);
      break;
    }
    case OP_TEMPERATURE_TINT: {
      rgb += vec3(amount * 0.6 + uParams[1] * 0.15, uParams[1] * 0.5, -amount * 0.6 + uParams[1] * 0.15) / 255.0;
      break;
    }
    case OP_SPLIT_TONING: {
      float pixelLum = lum(rgb);
      float shadowWeight = (1.0 - pixelLum) * uParams[6];
      float highlightWeight = pixelLum * uParams[6];
      rgb += (vec3(uParams[0], uParams[1], uParams[2]) - vec3(128.0)) * shadowWeight / 255.0;
      rgb += (vec3(uParams[3], uParams[4], uParams[5]) - vec3(128.0)) * highlightWeight / 255.0;
      break;
    }
    case OP_RGB_BLACK_POINT: {
      rgb = applyBlackPoint(rgb, vec3(uParams[0], uParams[1], uParams[2]));
      break;
    }
    case OP_RGB_WHITE_POINT: {
      rgb = applyWhitePoint(rgb, vec3(uParams[0], uParams[1], uParams[2]));
      break;
    }
    case OP_RGB_MIDTONES: {
      rgb = applyMidtoneGamma(rgb, vec3(uParams[0], uParams[1], uParams[2]));
      break;
    }
    case OP_SHARPEN: {
      if (amount > 0.0) {
        float strength = amount / 100.0;
        vec3 center = sampleClamped(texel);
        vec3 neighbors = sampleClamped(texel + ivec2(-1, 0))
          + sampleClamped(texel + ivec2(1, 0))
          + sampleClamped(texel + ivec2(0, -1))
          + sampleClamped(texel + ivec2(0, 1));
        rgb = center * (1.0 + 4.0 * strength) - neighbors * strength;
      }
      break;
    }
    case OP_HDR: {
      // Fixed: the original always looped the full -12..12 range (625
      // samples) and discarded anything outside radius with an if
      // inside the loop. Bounding the loop itself to the actual radius
      // gives the identical result (box-blur averaging is exact either
      // way — this is not an approximation) for a fraction of the cost.
      // radius=3 now does 49 samples instead of 625.
      if (amount > 0.0) {
        float strength = amount / 100.0;
        int iRadius = int(clamp(uParams[1], 0.0, 12.0));
        vec3 average = vec3(0.0);
        float currentLum = lum(sampleClamped(texel));
        float sampleCount = 0.0;
        for (int y = -iRadius; y <= iRadius; y++) {
          for (int x = -iRadius; x <= iRadius; x++) {
            average += vec3(lum(sampleClamped(texel + ivec2(x, y))));
            sampleCount += 1.0;
          }
        }
        average /= sampleCount;
        rgb += (currentLum - average) * (strength * 1.5);
      }
      break;
    }
    case OP_HUE_ROTATION: {
      rgb = applyHslRotation(rgb, amount / 360.0);
      break;
    }
  }

  outColor = vec4(clamp(rgb, 0.0, 1.0), color.a);
}`;
