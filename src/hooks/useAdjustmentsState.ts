import { useMemo, useState } from 'react';

import { DEFAULTS, PRESETS } from '@/middleware/interface/adjustments/state';
import { Adjustments, Stage } from '@/middleware/interface/adjustments/types';
import {
  applyIf,
  brightnessStage,
  contrastStage,
  exposureStage,
  fadeStage,
  gammaStage,
  grainStage,
  hdrEffectStage,
  invertStage,
  luminosityStage,
  perChannelGammaStage,
  popStage,
  removeFilmBaseStage,
  rgbBlackPointStage,
  rgbMidtonesStage,
  rgbWhitePointStage,
  saturationStage,
  sharpenStage,
  splitToningStage,
  temperatureTintStage,
  vibranceStage,
  vignetteStage,
  whitesBlacksStage
} from '@/middleware/interface/adjustments/utils';

type UseAdjustmentsStateOptions = {
  initialPreset?: Partial<Adjustments>;
};

export default function useAdjustmentsState({ initialPreset }: UseAdjustmentsStateOptions = {}) {
  const [preset, setPreset] = useState('Clean Digital');
  const [adj, setAdj] = useState<Adjustments>(() => ({ ...DEFAULTS, ...initialPreset }));

  const set = <K extends keyof Adjustments>(key: K, value: Adjustments[K]) => {
    setAdj((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (name: string) => {
    setPreset(name);
    setAdj({ ...DEFAULTS, ...PRESETS[name] });
  };

  const applyCustomPreset = (custom: Partial<Adjustments>) => {
    setPreset('Custom');
    setAdj({ ...DEFAULTS, ...custom });
  }

  const pipeline = useMemo<(Stage | null)[]>(
    () => [
    // 1. Film base / inversion
      applyIf(
        adj.baseColorOn,
        removeFilmBaseStage(
          { r: adj.baseColorR, g: adj.baseColorG, b: adj.baseColorB },
          {
            r: adj.orangeMaskStrengthR,
            g: adj.orangeMaskStrengthG,
            b: adj.orangeMaskStrengthB,
          }),
      ),
      applyIf(adj.invert, invertStage()),

      // 2. White balance
      applyIf(adj.temperatureOn, temperatureTintStage(adj.temperature, adj.tint)),

      // 3. Exposure (moved before contrast/luminosity)
      applyIf(adj.exposureOn, exposureStage(adj.exposure)),

      // 4. Tone
      applyIf(adj.brightnessOn, brightnessStage(adj.brightness)),
      applyIf(adj.contrastOn, contrastStage(adj.contrast)),
      applyIf(adj.luminosityOn, luminosityStage(adj.luminosity)),

      // 5. RGB point controls
      applyIf(adj.whitePointOn, rgbWhitePointStage(adj.whiteR, adj.whiteG, adj.whiteB)),
      applyIf(adj.blackPointOn, rgbBlackPointStage(adj.blackR, adj.blackG, adj.blackB)),
      applyIf(adj.midtonesOn, rgbMidtonesStage(adj.midtonesR, adj.midtonesG, adj.midtonesB)),

      applyIf(adj.wbkOn, whitesBlacksStage(adj.whites, adj.blacks)),

      // 7. Gamma — merged into one block (regular then per-channel)
      applyIf(adj.gammaOn, gammaStage(adj.gamma)),
      applyIf(adj.perChannelGammaOn, perChannelGammaStage(adj.gammaR, adj.gammaG, adj.gammaB)),

      // 8. Color / creative grading
      applyIf(adj.popOn, popStage(adj.pop)),
      applyIf(adj.hdrEffectOn, hdrEffectStage(adj.hdrEffect, adj.hdrRadius)),
      applyIf(adj.saturationOn, saturationStage(adj.saturation)),
      applyIf(adj.vibranceOn, vibranceStage(adj.vibrance)),
      applyIf(
        adj.splitToneOn,
        splitToningStage(
          adj.shadowTintR,
          adj.shadowTintG,
          adj.shadowTintB,
          adj.highlightTintR,
          adj.highlightTintG,
          adj.highlightTintB,
          adj.splitToneStrength
        )
      ),

      // 9. Fade (matte black lift, sits on top of the finished grade)
      applyIf(adj.fadeOn, fadeStage(adj.fade)),

      // 10. Sharpen (before grain, so it doesn't chase noise)
      applyIf(adj.sharpenOn, sharpenStage(adj.sharpen)),

      // 11. Finishing overlays
      applyIf(adj.vignetteOn, vignetteStage(adj.vignette)),
      applyIf(adj.grainOn, grainStage(adj.grain)),
    ],
  [adj],
  );

  return {
    adj,
    applyPreset,
    applyCustomPreset,
    pipeline,
    preset,
    defaults: DEFAULTS,
    presets: PRESETS,
    set,
  };
}
