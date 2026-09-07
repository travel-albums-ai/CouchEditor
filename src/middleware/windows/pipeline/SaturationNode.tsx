import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "saturation",
});
