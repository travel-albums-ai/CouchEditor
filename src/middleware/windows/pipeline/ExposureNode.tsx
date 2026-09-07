import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  min: -3,
  max: 3,
  step: 0.1,
  defaultValue: 0,
  type: "exposure",
});
