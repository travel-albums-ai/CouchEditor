import { shadowsStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/AdjustmentPreview';
import { createSliderNode } from "../AdjustmentSliderNode";

export default createSliderNode({
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "shadows",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={shadowsStage} label="Shadows" />
});
