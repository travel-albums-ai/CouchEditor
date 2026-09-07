import { brightnessStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/AdjustmentPreview';
import { createSliderNode } from '@/middleware/windows/pipeline/AdjustmentSliderNode';

export default createSliderNode({
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "brightness",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={brightnessStage} label="Brightness" />
});
