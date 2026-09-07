import { createSliderNode } from '@/middleware/windows/pipeline/AdjustmentSliderNode';

export default createSliderNode({
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "brightness",
});
