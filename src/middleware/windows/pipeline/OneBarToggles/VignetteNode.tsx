import { vignetteStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/components/AdjustmentPreview';
import { createSliderNode } from "../components/AdjustmentSliderNode";

export default createSliderNode({
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
  type: "vignette",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={vignetteStage} label="Vignette" />
});
