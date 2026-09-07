import { hueRotationStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/AdjustmentPreview';
import { createSliderNode } from '@/middleware/windows/pipeline/AdjustmentSliderNode';

export default createSliderNode({
  min: -180,
  max: 180,
  step: 1,
  defaultValue: 0,
  type: "hue-rotation",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={hueRotationStage} label="Hue Rotation" />
});
