import { usePipelineStore } from '@/context/pipelineStore';
import { useEffect } from 'react';
import './webMcpTypes';

export default function WebMCPGetCurrentPipeline() {
  const { currentPipeline } = usePipelineStore();

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

    document.modelContext
      .registerTool(
        {
          name: 'get_current_pipeline',
          title: 'Get Current Pipeline',
          description:
            'Get the current pipeline, including its name, id, dirty state, nodes, and edges.',
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
            return JSON.stringify(currentPipeline);
          },
        },
        { signal: controller.signal },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('[WebMCP] Failed to register get_current_pipeline:', error);
        }
      });

    return () => controller.abort();
  }, [currentPipeline]);

  return null;
}
