import { usePipelineStore } from '@/context/pipelineStore';
import { useEffect } from 'react';

type WebMCPModelContext = {
  registerTool: (
    tool: {
      name: string;
      title?: string;
      description: string;
      inputSchema?: Record<string, unknown>;
      annotations?: {
        readOnlyHint?: boolean;
        destructiveHint?: boolean;
        idempotentHint?: boolean;
        openWorldHint?: boolean;
      };
      execute: (input: Record<string, never>) => Promise<string> | string;
    },
    options?: {
      signal?: AbortSignal;
    },
  ) => Promise<void>;
};

declare global {
  interface Document {
    modelContext?: WebMCPModelContext;
  }
}

export default function WebMCPCurrentPipeline() {
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
        {
          signal: controller.signal,
        },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error(
            '[WebMCP] Failed to register get_current_pipeline:',
            error,
          );
        }
      });

    return () => {
      controller.abort();
    };
  }, [currentPipeline]);

  return null;
}
