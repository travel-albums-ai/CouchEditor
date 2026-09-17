import { createAIImageEditNode } from "./AIImageEditNode";

export default createAIImageEditNode({
  type: "ai-photo-editor",
  titleKey: "pipelineAiPhotoEditor",
  actionLabelKey: "aiPhotoEditorPrompt",
  editablePrompt: true,
  promptLabelKey: "aiPhotoEditorPrompt",
  promptPlaceholderKey: "aiPhotoEditorPromptPlaceholder",
});
