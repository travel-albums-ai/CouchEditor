export type Stage = (img: ImageData) => void;

export interface Adjustments {
  invert: boolean;

  brightnessOn: boolean;
  brightness: number;

  exposureOn: boolean;
  exposure: number;

  hdrEffectOn: boolean;
  hdrEffect: number;
  hdrRadius: number

  popOn: boolean;
  pop:number;

  contrastOn: boolean;

  contrast: number;

  saturationOn: boolean;
  saturation: number;

  vibranceOn: boolean;
  vibrance: number;

  temperatureOn: boolean;
  temperature: number;
  tint: number;

  luminosityOn: boolean;
  luminosity: number;

  wbkOn: boolean;
  whites: number;
  blacks: number;

  gammaOn: boolean;
  gamma: number;

  splitToneOn: boolean;

  shadowTintR: number;
  shadowTintG: number;
  shadowTintB: number;

  highlightTintR: number;
  highlightTintG: number;
  highlightTintB: number;

  splitToneStrength: number;

  blackPointOn: boolean;
  blackR: number;
  blackG: number;
  blackB: number;

  whitePointOn: boolean;
  whiteR: number;
  whiteG: number;
  whiteB: number;

  midtonesOn: boolean;
  midtonesR: number;
  midtonesG: number;
  midtonesB: number;

  fadeOn: boolean;
  fade: number;

  vignetteOn: boolean;
  vignette: number;

  grainOn: boolean;
  grain: number;

  sharpenOn: boolean;
  sharpen: number;

  baseColorOn: boolean;
  baseColorR: number;
  baseColorG: number;
  baseColorB: number;

  orangeMaskStrengthR: number;
  orangeMaskStrengthG: number;
  orangeMaskStrengthB: number;

  perChannelGammaOn: boolean;
  gammaR: number;
  gammaG: number;
  gammaB: number;
}
