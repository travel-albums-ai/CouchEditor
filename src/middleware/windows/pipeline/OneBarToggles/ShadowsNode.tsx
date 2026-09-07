import { shadowsStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/components/AdjustmentPreview';
import { createSliderNode } from "../components/AdjustmentSliderNode";

export default createSliderNode({
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "shadows",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={shadowsStage} label="Shadows" />
});
