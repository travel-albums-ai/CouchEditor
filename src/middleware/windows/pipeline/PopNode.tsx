import { popStage } from '@/lib/utils';
import { AdjustmentPreview } from './AdjustmentPreview';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "pop",
  info: ({ amount }) => (
    <AdjustmentPreview amount={amount} algorithm={popStage} label="POP" />
  ),
});
