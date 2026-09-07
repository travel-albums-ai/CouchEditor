import { brightnessStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/components/AdjustmentPreview';
import { createSliderNode } from '@/middleware/windows/pipeline/components/AdjustmentSliderNode';

export default createSliderNode({
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "brightness",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={brightnessStage} label="Brightness" />
});
