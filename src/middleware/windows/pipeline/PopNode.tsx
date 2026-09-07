import { createSliderNode } from "./AdjustmentSliderNode";
import { popStage } from '@/lib/utils';
import { AdjustmentPreview } from './AdjustmentPreview';

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
