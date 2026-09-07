import GeneticBreedingGridBody from '@/middleware/interface/adjustments/GeneticBreedingGridBody';
import { ADJUSTMENTS_RANGES } from '@/middleware/interface/adjustments/state';
import { Adjustments } from '@/middleware/interface/adjustments/types';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

type AdjustmentRangeKey = keyof typeof ADJUSTMENTS_RANGES;

// ---------- helpers ----------
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

function gaussian() {
  let u = 0;
  let v = 0;

  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const mutateNumber = (value: number, sigma: number) =>
  value + gaussian() * sigma;

const mutateBool = (v: boolean) =>
  Math.random() < 0.05 ? !v : v;

// Mutation step size, as a fraction of a field's full range (max - min).
// Starts exploring broadly, then decays smoothly toward small refinement
// steps so the population actually converges instead of jumping around
// indefinitely. Driven off ADJUSTMENTS_RANGES so every field's step size is
// automatically proportional to its own span — no per-field tuning needed.
const MAX_SIGMA_FRACTION = 0.04;
const MIN_SIGMA_FRACTION = 0.002;
const SIGMA_DECAY_RATE = 0.95; // per generation

const getSigmaFraction = (gen: number) =>
  MIN_SIGMA_FRACTION + (MAX_SIGMA_FRACTION - MIN_SIGMA_FRACTION) * Math.pow(SIGMA_DECAY_RATE, gen);

// Probability, per gene, that it mutates at all in a given generation. Also
// decays over generations so later breeding rounds make smaller, sparser
// tweaks instead of constantly re-rolling every gene.
const MAX_MUTATION_RATE = 0.25;
const MIN_MUTATION_RATE = 0.05;
const MUTATION_DECAY = 0.97; // per generation

const getMutationRate = (generation: number) =>
  MIN_MUTATION_RATE + (MAX_MUTATION_RATE - MIN_MUTATION_RATE) * Math.pow(MUTATION_DECAY, generation);

const setGene = <K extends keyof Adjustments>(target: Adjustments, key: K, value: Adjustments[K]) => {
  target[key] = value;
};

// Maps a gene to the On-flag(s) that gate it. A gene with no entry here is
// always active. A gene whose flag(s) are false in the base preset is locked
// to the base preset's value rather than bred/mutated.
const ON_FLAG_MAP: Partial<Record<keyof Adjustments, (keyof Adjustments)[]>> = {
  invert: ['invertOn'],

  exposure: ['exposureOn'],
  brightness: ['brightnessOn'],
  contrast: ['contrastOn'],
  pop: ['popOn'],

  hdrEffect: ['hdrEffectOn'],
  hdrRadius: ['hdrEffectOn'],

  temperature: ['temperatureOn'],
  tint: ['temperatureOn'],

  gamma: ['gammaOn'],
  saturation: ['saturationOn'],
  vibrance: ['vibranceOn'],

  whites: ['wbkOn'],
  blacks: ['wbkOn'],

  splitToneStrength: ['splitToneOn'],
  shadowTintR: ['splitToneOn'],
  shadowTintG: ['splitToneOn'],
  shadowTintB: ['splitToneOn'],
  highlightTintR: ['splitToneOn'],
  highlightTintG: ['splitToneOn'],
  highlightTintB: ['splitToneOn'],

  midtonesR: ['midtonesOn'],
  midtonesG: ['midtonesOn'],
  midtonesB: ['midtonesOn'],
  blackR: ['blackPointOn'],
  blackG: ['blackPointOn'],
  blackB: ['blackPointOn'],
  whiteR: ['whitePointOn'],
  whiteG: ['whitePointOn'],
  whiteB: ['whitePointOn'],

  vignette: ['vignetteOn'],
  fade: ['fadeOn'],
  grain: ['grainOn'],
  sharpen: ['sharpenOn'],

  baseColorR: ['baseColorOn'],
  baseColorG: ['baseColorOn'],
  baseColorB: ['baseColorOn'],
  orangeMaskStrengthR: ['baseColorOn'],
  orangeMaskStrengthG: ['baseColorOn'],
  orangeMaskStrengthB: ['baseColorOn'],

  gammaR: ['perChannelGammaOn'],
  gammaG: ['perChannelGammaOn'],
  gammaB: ['perChannelGammaOn'],
};

const isGeneEnabled = (k: keyof Adjustments, activationMask: Adjustments) => {
  const onKeys = ON_FLAG_MAP[k];
  return !onKeys || onKeys.every(ok => activationMask[ok]);
};

function shuffled<T>(arr: T[]) {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

// ---------- evolution ----------
function breed(
  parents: Adjustments[],
  sigmaFraction: number,
  mutationRate: number,
  activationMask: Adjustments
): Adjustments {
  const child: Adjustments = { ...parents[0] };
  const keys = Object.keys(child) as (keyof Adjustments)[];

  // 1. Inherit each gene from a random parent, then maybe mutate it.
  for (const k of keys) {
    const values = parents.map(p => p[k]);
    let value = values[Math.floor(Math.random() * values.length)];

    if (typeof value === 'boolean') {
      value = mutateBool(value);
    } else if (
      typeof value === 'number' &&
      isGeneEnabled(k, activationMask) &&
      Math.random() < mutationRate
    ) {
      const range = ADJUSTMENTS_RANGES[k as AdjustmentRangeKey];
      const span = range ? range.max - range.min : 100;
      value = mutateNumber(value, span * sigmaFraction);
    }

    setGene(child, k, value as Adjustments[typeof k]);
  }

  // 2. On-flags always follow the base preset — they're never inherited or mutated.
  for (const k of keys) {
    if (typeof child[k] === 'boolean' && k.toString().endsWith('On')) {
      setGene(child, k, activationMask[k] as Adjustments[typeof k]);
    }
  }

  // 3. Genes whose On-flag is off in the base preset snap back to baseline,
  // so disabled adjustments never silently drift away from it.
  for (const k of keys) {
    if (typeof child[k] === 'number' && !isGeneEnabled(k, activationMask)) {
      setGene(child, k, activationMask[k] as Adjustments[typeof k]);
    }
  }

  // 4. Clamp every numeric gene to its supported range. This is the only
  // place bounds are enforced, so nothing can ever mutate out of range.
  for (const k of keys) {
    const range = ADJUSTMENTS_RANGES[k as AdjustmentRangeKey];
    if (range && typeof child[k] === 'number') {
      setGene(child, k, clamp(child[k] as number, range.min * range.scale, range.max * range.scale) as Adjustments[typeof k]);
    }
  }

  return child;
}

// ---------- component ----------
export default function GeneticBreedingGrid({
  url,
  basePreset,
  propagateSelection = () => {}
}: {
  url: string;
  basePreset: Adjustments;
  propagateSelection: (obj: Adjustments | null) => void;
}) {
  const [generation, setGeneration] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [population, setPopulation] = useState<Adjustments[]>(
    () => Array.from({ length: 9 }, () => structuredClone(basePreset))
  );

  const mutationRate = useMemo(() => getMutationRate(generation), [generation]);
  const sigmaFraction = useMemo(() => getSigmaFraction(generation), [generation]);

  const randomIndividual = (base: Adjustments): Adjustments => {
    const obj = structuredClone(base);

    for (const key of Object.keys(obj) as (keyof Adjustments)[]) {
      const range = ADJUSTMENTS_RANGES[key as AdjustmentRangeKey];

      if (
        range &&
      typeof obj[key] === "number" &&
      isGeneEnabled(key, base)
      ) {
        obj[key] =
        (range.min + Math.random() * (range.max - range.min)) *
        range.scale as any;
      }
    }

    return obj;
  };

  useEffect(() => {
    propagateSelection(population.at(hoveredIndex ?? 0) ?? null);
  }, [population, propagateSelection, hoveredIndex]);

  function breedNext() {
    const elites = selected.map(i => population[i]);
    const parents = elites.length ? elites : population.slice(0, 2);

    const next: Adjustments[] = [];

    next.push(structuredClone(parents[0]));
    next.push(structuredClone(parents[1] ?? parents[0]));

    next.push(randomIndividual(basePreset));

    for (let i = 1; i < 7; i++) {
      const mixSize =
        Math.random() < 0.4 ? 2 :
          Math.random() < 0.7 ? 3 :
            parents.length;

      const sample = shuffled(parents).slice(0, Math.min(mixSize, parents.length));

      next.push(breed(sample, sigmaFraction, mutationRate, basePreset));
    }

    next.push(breed([basePreset], sigmaFraction, mutationRate, basePreset));

    setPopulation(next);
    setSelected([]);
    setGeneration(g => g + 1);
  }

  function reset() {
    setPopulation(Array.from({ length: 9 }, () => structuredClone(basePreset)));
    setSelected([]);
    setGeneration(0);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', alignSelf: 'stretch', flex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 700 }} variant="caption">
            Generation {generation} · σ {(sigmaFraction * 100).toFixed(1)}% · mutation {(mutationRate * 100).toFixed(0)}%
          </Typography>
          <Typography sx={{ fontWeight: 700 }} variant="caption">
            Hovered: {hoveredIndex !== null ? hoveredIndex : 'None'} | Selected: {selected.map(i => i + 1).join(', ') || 'None'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row' }}>
          <Button variant="outlined" onClick={reset}>
            Reset
          </Button>

          <Button variant="outlined" onClick={breedNext}>
            Breed Next Generation
          </Button>
        </Box>
      </Box>

      <GeneticBreedingGridBody
        url={url}
        basePreset={basePreset}
        population={population}
        selected={selected}
        setSelected={setSelected}
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
      />
    </Box>
  );
}
