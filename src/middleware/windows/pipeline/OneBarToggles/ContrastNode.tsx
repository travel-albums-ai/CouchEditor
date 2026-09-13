import { contrastStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/components/AdjustmentPreview';
import { createSliderNode } from "../components/AdjustmentSliderNode";

export default createSliderNode({
  // min: -100,
  // max: 1200,
  // step: 1,
  // defaultValue: 0,
  type: "contrast",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={contrastStage} label="Contrast" />
});
