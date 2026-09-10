export type GpuOperation = {
  kind:
    | "invert"
    | "black-white"
    | "sepia"
    | "brightness"
    | "highlights"
    | "shadows"
    | "gamma"
    | "luminosity"
    | "exposure"
    | "contrast"
    | "saturation"
    | "vibrance"
    | "fade"
    | "vignette"
    | "grain"
    | "sharpen"
    | "pop"
    | "hdr"
    | "whites-blacks"
    | "temperature-tint"
    | "split-toning"
    | "rgb-black-point"
    | "rgb-white-point"
    | "rgb-midtones"
    | "hue-rotation";
  params?: number[];
};

export const gpuVertexShader = `#version 300 es
in vec2 aPosition;
in vec2 aTexCoord;
out vec2 vTexCoord;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = aTexCoord;
}`;

export const gpuFragmentShader = `#version 300 es
precision highp float;

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

void main() {
  vec4 color = texture(uImage, vTexCoord);
  vec3 rgb = color.rgb;
  float amount = uParams[0];

  if (uOperation == 1) {
    rgb = 1.0 - rgb;
  } else if (uOperation == 2) {
    rgb = vec3(lum(rgb));
  } else if (uOperation == 3) {
    rgb = vec3(
      dot(rgb, vec3(0.393, 0.769, 0.189)),
      dot(rgb, vec3(0.349, 0.686, 0.168)),
      dot(rgb, vec3(0.272, 0.534, 0.131))
    );
  } else if (uOperation == 4) {
    rgb += amount / 255.0;
  } else if (uOperation == 5 || uOperation == 6) {
    float weight = uOperation == 5 ? lum(rgb) : 1.0 - lum(rgb);
    weight *= weight * amount;
    rgb = amount >= 0.0
      ? mix(rgb, vec3(1.0), weight)
      : rgb + rgb * weight;
  } else if (uOperation == 7) {
    rgb = pow(max(rgb, vec3(0.0)), vec3(amount));
  } else if (uOperation == 8) {
    rgb = mix(rgb, vec3(lum(rgb)), amount);
  } else if (uOperation == 9) {
    rgb *= pow(2.0, amount);
  } else if (uOperation == 10) {
    float factor = (259.0 * (amount + 255.0)) / (255.0 * (259.0 - amount));
    rgb = factor * (rgb - vec3(128.0 / 255.0)) + vec3(128.0 / 255.0);
  } else if (uOperation == 11) {
    float factor = 1.0 + amount / 100.0;
    rgb = vec3(lum(rgb)) + (rgb - vec3(lum(rgb))) * factor;
  } else if (uOperation == 12) {
    float strength = amount / 100.0;
    float maxColor = max(rgb.r, max(rgb.g, rgb.b));
    float average = (rgb.r + rgb.g + rgb.b) / 3.0;
    float saturation = maxColor == 0.0 ? 0.0 : (maxColor - average) / maxColor;
    rgb += (rgb - vec3(average)) * (strength * (1.0 - saturation));
  } else if (uOperation == 13) {
    float strength = amount / 100.0;
    rgb = rgb * (1.0 - 0.3 * strength) + vec3(28.0 / 255.0 * strength);
  } else if (uOperation == 14) {
    float strength = amount / 100.0;
    if (strength > 0.0) {
      vec2 centered = (gl_FragCoord.xy - uResolution * 0.5);
      float maxDistance = dot(uResolution * 0.5, uResolution * 0.5);
      float falloff = 1.0 - strength * pow(dot(centered, centered), 1.1) / pow(maxDistance, 1.1);
      rgb = mix(vec3(uParams[1], uParams[2], uParams[3]), rgb, falloff);
    }
  } else if (uOperation == 15) {
    if (amount > 0.0) {
      float noise = (randomNoise(gl_FragCoord.xy) - 0.5) * (amount / 100.0 * 35.0) / 255.0;
      rgb += vec3(noise);
    }
  } else if (uOperation == 16) {
    if (amount > 0.0) {
      float strength = amount / 100.0;
      float contrastFactor = 1.0 + 0.5 * strength;
      float saturationFactor = 1.0 + 0.6 * strength;
      rgb = contrastFactor * (rgb - vec3(128.0 / 255.0)) + vec3(128.0 / 255.0);
      rgb = vec3(lum(rgb)) + (rgb - vec3(lum(rgb))) * saturationFactor;
    }
  } else if (uOperation == 17) {
    rgb = clamp(rgb + vec3(amount / 255.0), 0.0, 1.0);
    rgb = clamp(rgb - vec3(uParams[1] / 255.0), 0.0, 1.0);
  } else if (uOperation == 18) {
    rgb += vec3(amount * 0.6 + uParams[1] * 0.15, uParams[1] * 0.5, -amount * 0.6 + uParams[1] * 0.15) / 255.0;
  } else if (uOperation == 19) {
    float pixelLum = lum(rgb);
    float shadowWeight = (1.0 - pixelLum) * uParams[6];
    float highlightWeight = pixelLum * uParams[6];
    rgb += (vec3(uParams[0], uParams[1], uParams[2]) - vec3(128.0)) * shadowWeight / 255.0;
    rgb += (vec3(uParams[3], uParams[4], uParams[5]) - vec3(128.0)) * highlightWeight / 255.0;
  } else if (uOperation == 20) {
    rgb = (rgb * 255.0 - vec3(uParams[0], uParams[1], uParams[2])) /
      max(vec3(1.0), vec3(255.0) - vec3(uParams[0], uParams[1], uParams[2])) / 255.0;
  } else if (uOperation == 21) {
    rgb = rgb * 255.0 / max(vec3(1.0), vec3(uParams[0], uParams[1], uParams[2]));
  } else if (uOperation == 22) {
    rgb = pow(max(rgb, vec3(0.0)), vec3(uParams[0], uParams[1], uParams[2]));
  } else if (uOperation == 23) {
    if (amount > 0.0) {
      float strength = amount / 100.0;
      vec3 neighbors = sampleClamped(ivec2(gl_FragCoord.xy) + ivec2(-1, 0))
        + sampleClamped(ivec2(gl_FragCoord.xy) + ivec2(1, 0))
        + sampleClamped(ivec2(gl_FragCoord.xy) + ivec2(0, -1))
        + sampleClamped(ivec2(gl_FragCoord.xy) + ivec2(0, 1));
      rgb = rgb * (1.0 + 4.0 * strength) - neighbors * strength;
    }
  } else if (uOperation == 24) {
    if (amount > 0.0) {
      float strength = amount / 100.0;
      float radius = clamp(uParams[1], 0.0, 12.0);
      vec3 average = vec3(0.0);
      float currentLum = lum(rgb);
      float sampleCount = 0.0;
      for (int y = -12; y <= 12; y++) {
        for (int x = -12; x <= 12; x++) {
          if (float(abs(x)) <= radius && float(abs(y)) <= radius) {
            average += vec3(lum(sampleClamped(ivec2(gl_FragCoord.xy) + ivec2(x, y))));
            sampleCount += 1.0;
          }
        }
      }
      average /= sampleCount;
      rgb += (currentLum - average) * (strength * 1.5);
    }
  } else if (uOperation == 25) {
    rgb = applyHslRotation(rgb, amount / 360.0);
  }

  outColor = vec4(clamp(rgb, 0.0, 1.0), color.a);
}`;

export const gpuOperationIds: Record<GpuOperation["kind"], number> = {
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
  sharpen: 23,
  pop: 16,
  hdr: 24,
  "whites-blacks": 17,
  "temperature-tint": 18,
  "split-toning": 19,
  "rgb-black-point": 20,
  "rgb-white-point": 21,
  "rgb-midtones": 22,
  "hue-rotation": 25,
};
