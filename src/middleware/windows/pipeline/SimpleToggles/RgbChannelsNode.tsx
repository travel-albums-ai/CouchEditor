import { createSliderNode } from '@/middleware/windows/pipeline/components/AdjustmentSliderNode';

export const RgbBlackPointNode = createSliderNode({
  type: 'rgb-black-point',
});

export const RgbWhitePointNode = createSliderNode({
  type: 'rgb-white-point',
});

export const RgbMidtonesNode = createSliderNode({
  type: 'rgb-midtones',
});
