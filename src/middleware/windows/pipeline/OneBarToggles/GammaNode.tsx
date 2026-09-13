import { createSliderNode } from "../components/AdjustmentSliderNode";

export default createSliderNode({
  // min: 0.1,
  // max: 3,
  // step: 0.01,
  // defaultValue: 1,
  type: "gamma",
  // info: ({ amount }) => <AdjustmentPreview amount={amount} algorithm={gammaStage} label="Gamma" />
});
