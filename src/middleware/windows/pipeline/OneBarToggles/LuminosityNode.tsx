import { luminosityStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/components/AdjustmentPreview';
import { createSliderNode } from "../components/AdjustmentSliderNode";

export default createSliderNode({
  min: 0,
  max: 2,
  step: 0.05,
  defaultValue: 0,
  type: "luminosity",
  info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={luminosityStage} label="Luminosity" />
});
