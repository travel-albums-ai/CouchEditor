import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "highlights",
  label: "Highlights",
  info: () => <small>Recover or control bright areas</small>,
});
