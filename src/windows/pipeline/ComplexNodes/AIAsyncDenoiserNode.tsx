import { createAIImageEditNode } from "./AIImageEditNode";

export default createAIImageEditNode({
  type: "ai-denoiser",
  titleKey: "aiAsyncDenoiser",
  actionLabelKey: "aiActionDenoised",
});
