import { grainStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/AdjustmentPreview';
import { createSliderNode } from "../AdjustmentSliderNode";

export default createSliderNode({
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "grain",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={grainStage} label="Grain" />
});
