import { hdrEffectStage } from '@/lib/utils';
import { AdjustmentPreview } from '../components/AdjustmentPreview';
import { createSliderNode } from "../components/AdjustmentSliderNode";

export default createSliderNode({
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "hdr",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={hdrEffectStage} label="HDR" />
});
