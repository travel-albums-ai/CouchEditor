import { createSliderNode } from "./AdjustmentSliderNode";
import { hdrEffectStage } from '@/lib/utils';
import { AdjustmentPreview } from './AdjustmentPreview';

export default createSliderNode({
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "hdr",
  info: ({ amount }) => (
    <AdjustmentPreview amount={amount} algorithm={hdrEffectStage} label="HDR" />
  )
});
