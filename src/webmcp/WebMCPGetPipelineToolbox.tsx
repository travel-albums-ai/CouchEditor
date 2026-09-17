import { paletteItems } from '@/windows/pipeline/NodePalette';
import { useEffect } from 'react';
import './webMcpTypes';

export default function WebMCPGetPipelineToolbox() {
  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();
    const toolbox = paletteItems.map((item) => ({
      type: item.type,
      group: item.groupKey,
      labelKey: item.labelKey,
      descriptionKey: item.labelDescription,
      processing: item.processing,
      ai: item.ai ?? false,
      properties: (item.configs ?? []).map((config) => ({
        key: config.key,
        min: config.min,
        max: config.max,
        step: config.step,
        defaultValue: config.defaultValue,
        labelKey: config.labelKey,
      })),
    }));

    document.modelContext
      .registerTool(
        {
          name: 'get_pipeline_toolbox',
          title: 'Get Pipeline Toolbox',
          description:
            'Get all pipeline node types available in the toolbox, grouped by category, including their exposed numeric properties and limits.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
          },
          async execute() {
            return JSON.stringify(toolbox);
          },
        },
        { signal: controller.signal },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('[WebMCP] Failed to register get_pipeline_toolbox:', error);
        }
      });

    return () => controller.abort();
  }, []);

  return null;
}
