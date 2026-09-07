import { Adjustments } from '@/middleware/interface/adjustments/types';

export const ADJUSTMENTS_RANGES = {
  vignette: { min: 0, max: 100, step: 1, scale: 10, defaultValue: 0 },
  hdrEffect: { min: 0, max: 100, step: 1, scale: 1, defaultValue: 0 },
  hdrRadius: { min: 0, max: 100, step: 1, scale: 1, defaultValue: 0 },
  pop: { min: 0, max: 100, step: 1, scale: 10, defaultValue: 0 },
  grain: { min: 0, max: 100, step: 1, scale: 10, defaultValue: 0 },
  fade: { min: 0, max: 100, step: 1, scale: 10, defaultValue: 0 },
  sharpen: { min: 0, max: 100, step: 1, scale: 10, defaultValue: 0 },
  saturation: { min: -100, max: 100, step: 1, scale: 1, defaultValue: 0 },
  vibrance: { min: 0, max: 100, step: 1, scale: 1, defaultValue: 0 },
  temperature: { min: -100, max: 100, step: 1, scale: 1, defaultValue: 0 },
  tint: { min: -100, max: 100, step: 1, scale: 1, defaultValue: 0 },
  exposure: { min: -100, max: 100, step: 1, scale: 0.01, defaultValue: 0 },
  brightness: { min: -100, max: 100, step: 1, scale: 1, defaultValue: 0 },
  contrast: { min: -100, max: 100, step: 1, scale: 1, defaultValue: 0 },
  gamma: { min: 0.1, max: 3, step: 0.01, scale: 1, defaultValue: 1 },
  blackB: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 0 },
  blackG: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 0 },
  blackR: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 0 },
  midtonesB: { min: 0, max: 3, step: 0.1, scale: 1, defaultValue: 1 },
  midtonesG: { min: 0, max: 3, step: 0.1, scale: 1, defaultValue: 1 },
  midtonesR: { min: 0, max: 3, step: 0.1, scale: 1, defaultValue: 1 },
  whiteB: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 255 },
  whiteG: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 255 },
  whiteR: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 255 },
  whites: { min: -100, max: 100, step: 1, scale: 1, defaultValue: 0 },
  blacks: { min: -100, max: 100, step: 1, scale: 1, defaultValue: 0 },
  gammaR: { min: 0.1, max: 3, step: 0.01, scale: 1, defaultValue: 1 },
  gammaG: { min: 0.1, max: 3, step: 0.01, scale: 1, defaultValue: 1 },
  gammaB: { min: 0.1, max: 3, step: 0.01, scale: 1, defaultValue: 1 },
  orangeMaskStrengthR: { min: 0, max: 100, step: 1, scale: 0.1, defaultValue: 1 },
  orangeMaskStrengthG: { min: 0, max: 100, step: 1, scale: 0.1, defaultValue: 1 },
  orangeMaskStrengthB: { min: 0, max: 100, step: 1, scale: 0.1, defaultValue: 1 },
  splitToneStrength: { min: 0, max: 100, step: 1, scale: 0.01, defaultValue: 0 },
  shadowTintR: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 128 },
  shadowTintG: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 128 },
  shadowTintB: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 128 },
  highlightTintR: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 128 },
  highlightTintG: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 128 },
  highlightTintB: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 128 },
  baseColorR: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 255 },
  baseColorG: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 255 },
  baseColorB: { min: 0, max: 255, step: 1, scale: 1, defaultValue: 255 },
}

export const DEFAULTS: Adjustments = {
  invert: false,

  brightnessOn: false,
  brightness: ADJUSTMENTS_RANGES.brightness.defaultValue,

  exposureOn: false,
  exposure: ADJUSTMENTS_RANGES.exposure.defaultValue,

  popOn: false,
  pop: ADJUSTMENTS_RANGES.pop.defaultValue,

  hdrEffectOn: false,
  hdrEffect: ADJUSTMENTS_RANGES.hdrEffect.defaultValue,
  hdrRadius: ADJUSTMENTS_RANGES.hdrRadius.defaultValue,

  midtonesOn: false,
  midtonesR: ADJUSTMENTS_RANGES.midtonesR.defaultValue,
  midtonesG: ADJUSTMENTS_RANGES.midtonesG.defaultValue,
  midtonesB: ADJUSTMENTS_RANGES.midtonesB.defaultValue,

  blackPointOn: false,
  blackR: ADJUSTMENTS_RANGES.blackR.defaultValue,
  blackG: ADJUSTMENTS_RANGES.blackG.defaultValue,
  blackB: ADJUSTMENTS_RANGES.blackB.defaultValue,

  whitePointOn: false,
  whiteR: ADJUSTMENTS_RANGES.whiteR.defaultValue,
  whiteG: ADJUSTMENTS_RANGES.whiteG.defaultValue,
  whiteB: ADJUSTMENTS_RANGES.whiteB.defaultValue,

  contrastOn: false,
  contrast: ADJUSTMENTS_RANGES.contrast.defaultValue,

  saturationOn: false,
  saturation: ADJUSTMENTS_RANGES.saturation.defaultValue,

  vibranceOn: false,
  vibrance: ADJUSTMENTS_RANGES.vibrance.defaultValue,

  temperatureOn: false,
  temperature: ADJUSTMENTS_RANGES.temperature.defaultValue,
  tint: ADJUSTMENTS_RANGES.tint.defaultValue,

  wbkOn: false,
  whites: ADJUSTMENTS_RANGES.whites.defaultValue,
  blacks: ADJUSTMENTS_RANGES.blacks.defaultValue,

  gammaOn: false,
  gamma: ADJUSTMENTS_RANGES.gamma.defaultValue,

  splitToneOn: false,
  splitToneStrength: ADJUSTMENTS_RANGES.splitToneStrength.defaultValue,
  shadowTintR: ADJUSTMENTS_RANGES.shadowTintR.defaultValue,
  shadowTintG: ADJUSTMENTS_RANGES.shadowTintG.defaultValue,
  shadowTintB: ADJUSTMENTS_RANGES.shadowTintB.defaultValue,
  highlightTintR: ADJUSTMENTS_RANGES.highlightTintR.defaultValue,
  highlightTintG: ADJUSTMENTS_RANGES.highlightTintG.defaultValue,
  highlightTintB: ADJUSTMENTS_RANGES.highlightTintB.defaultValue,

  fadeOn: false,
  fade: ADJUSTMENTS_RANGES.fade.defaultValue,

  vignetteOn: false,
  vignette: ADJUSTMENTS_RANGES.vignette.defaultValue,

  grainOn: false,
  grain: ADJUSTMENTS_RANGES.grain.defaultValue,

  sharpenOn: false,
  sharpen: ADJUSTMENTS_RANGES.sharpen.defaultValue,

  baseColorOn: false,
  baseColorR: ADJUSTMENTS_RANGES.baseColorR.defaultValue,
  baseColorG: ADJUSTMENTS_RANGES.baseColorG.defaultValue,
  baseColorB: ADJUSTMENTS_RANGES.baseColorB.defaultValue,
  orangeMaskStrengthR: ADJUSTMENTS_RANGES.orangeMaskStrengthR.defaultValue,
  orangeMaskStrengthG: ADJUSTMENTS_RANGES.orangeMaskStrengthG.defaultValue,
  orangeMaskStrengthB: ADJUSTMENTS_RANGES.orangeMaskStrengthB.defaultValue,

  perChannelGammaOn: false,
  gammaR: ADJUSTMENTS_RANGES.gammaR.defaultValue,
  gammaG: ADJUSTMENTS_RANGES.gammaG.defaultValue,
  gammaB: ADJUSTMENTS_RANGES.gammaB.defaultValue,
};

export const INSTAGRAM_PRESETS: Record<string, Partial<Adjustments>> = {
  'Sunkissed Glow': {
    brightnessOn: true, brightness: 8,
    temperatureOn: true, temperature: 20, tint: -5,
    vibranceOn: true, vibrance: 35,
    vignetteOn: true, vignette: 15,
    fadeOn: true, fade: 10,
  },
  'Valencia Fade': {
    fadeOn: true, fade: 30,
    temperatureOn: true, temperature: 12,
    saturationOn: true, saturation: -10,
    vignetteOn: true, vignette: 20,
  },
};

export const OLD_SCHOOL_PRESETS: Record<string, Partial<Adjustments>> = {
  'Faded Polaroid': {
    fadeOn: true, fade: 45,
    contrastOn: true, contrast: -15,
    whitePointOn: true, whiteR: 240, whiteG: 235, whiteB: 225,
    vignetteOn: true, vignette: 25,
    grainOn: true, grain: 15,
  },
  'Vintage Kodachrome': {
    saturationOn: true, saturation: 25,
    contrastOn: true, contrast: 15,
    temperatureOn: true, temperature: 8,
    grainOn: true, grain: 25,
    vignetteOn: true, vignette: 20,
  },
  'Silver Gelatin B&W': {
    saturationOn: true, saturation: -100,
    contrastOn: true, contrast: 20,
    grainOn: true, grain: 35,
    sharpenOn: true, sharpen: 10,
  },
  '70s Film Grain': {
    fadeOn: true, fade: 20,
    grainOn: true, grain: 40,
    temperatureOn: true, temperature: 10,
    saturationOn: true, saturation: -10,
    vignetteOn: true, vignette: 15,
  },
};

export const ADJUSTMENTS_CONVERSION_PRESETS: Record<string, Partial<Adjustments>> = {
  'Ilford HP5 Plus (B&W Negative)': {
    invert: true,
    saturationOn: true, saturation: -100,
    contrastOn: true, contrast: 20,
    gammaOn: true, gamma: 1.6,
    grainOn: true, grain: 20,
  },
};

export const OTHER_PRESETS: Record<string, Partial<Adjustments>> = {
  'HDR Punch': {
    hdrEffectOn: true, hdrEffect: 60, hdrRadius: 40,
    contrastOn: true, contrast: 20,
    sharpenOn: true, sharpen: 25,
    saturationOn: true, saturation: 15,
  },
  'Dreamy Soft Glow': {
    fadeOn: true, fade: 35,
    hdrEffectOn: true, hdrEffect: 10, hdrRadius: 70,
    whitePointOn: true, whiteR: 250, whiteG: 248, whiteB: 245,
    splitToneOn: true, splitToneStrength: 10,
  },
  'High Key Bright': {
    brightnessOn: true, brightness: 20,
    exposureOn: true, exposure: 15,
    whitePointOn: true, whiteR: 255, whiteG: 255, whiteB: 255,
    blackPointOn: true, blackR: 30, blackG: 30, blackB: 30,
    contrastOn: true, contrast: -10,
  },
};

export const PRESETS: Record<string, Partial<Adjustments>> = {
  'Default': {},
  ...INSTAGRAM_PRESETS,
  ...OLD_SCHOOL_PRESETS,
  ...ADJUSTMENTS_CONVERSION_PRESETS,
  ...OTHER_PRESETS,
};
