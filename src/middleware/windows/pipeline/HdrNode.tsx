import { createSliderNode } from "./AdjustmentSliderNode";
import { HdrPreview } from './HdrPreview';

export default createSliderNode({
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "hdr",
  info: ({ amount }) => <HdrPreview amount={amount} />
});
