import { exposureStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/components/AdjustmentPreview';
import { createSliderNode } from "../components/AdjustmentSliderNode";

export default createSliderNode({
  min: -3,
  max: 3,
  step: 0.1,
  defaultValue: 0,
  type: "exposure",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={exposureStage} label="Exposure" />
});
