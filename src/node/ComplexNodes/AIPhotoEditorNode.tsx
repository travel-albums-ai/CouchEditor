import { createAIImageEditNode } from "../ComplexNodes/AIImageEditNode";

export default createAIImageEditNode({
  type: "ai-photo-editor",
  titleKey: "pipelineAiPhotoEditor",
  actionLabelKey: "aiPhotoEditorPrompt",
  editablePrompt: true,
  promptLabelKey: "aiPhotoEditorPrompt",
  promptPlaceholderKey: "aiPhotoEditorPromptPlaceholder",
});
