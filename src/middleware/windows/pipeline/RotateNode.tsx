import { createSliderNode } from "./AdjustmentSliderNode";
import { BeforeAfter } from "./BeforeAfter";

export default createSliderNode({
  min: 0,
  max: 360,
  step: 1,
  defaultValue: 0,
  type: "rotate",
  info: (config) => <>
    <BeforeAfter image2style={{ transform: `rotate(${config.amount}deg)` }} />
  </>
});
