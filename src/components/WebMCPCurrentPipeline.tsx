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
      execute: (input: Record<string, unknown>) => Promise<string> | string;
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
  const { currentPipeline, setCurrentPipeline } = usePipelineStore();

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

    document.modelContext
      .registerTool(
        {
          name: 'delete_pipeline_node',
          title: 'Delete Pipeline Node',
          description: 'Delete a node from the current pipeline by node id.',

          inputSchema: {
            type: 'object',
            properties: {
              nodeId: {
                type: 'string',
                description: 'The id of the node to delete.',
              },
            },
            required: ['nodeId'],
            additionalProperties: false,
          },

          annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: true,
            openWorldHint: false,
          },

          async execute({ nodeId }) {
            if (typeof nodeId !== 'string') {
              return 'A valid nodeId is required.';
            }

            if (!currentPipeline.nodes.some((node) => node.id === nodeId)) {
              return `Pipeline node not found: ${nodeId}`;
            }

            const nodes = currentPipeline.nodes.filter((node) => node.id !== nodeId);
            const edges = currentPipeline.edges.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId,
            );

            setCurrentPipeline({ ...currentPipeline, nodes, edges, isDirty: true });
            window.dispatchEvent(new CustomEvent('pipeline:graph-updated', {
              detail: { nodes, edges },
            }));

            return `Deleted pipeline node: ${nodeId}`;
          },
        },
        {
          signal: controller.signal,
        },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error(
            '[WebMCP] Failed to register delete_pipeline_node:',
            error,
          );
        }
      });

    document.modelContext
      .registerTool(
        {
          name: 'clone_pipeline_node',
          title: 'Clone Pipeline Node',
          description: 'Clone a node in the current pipeline by node id.',

          inputSchema: {
            type: 'object',
            properties: {
              nodeId: {
                type: 'string',
                description: 'The id of the node to clone.',
              },
            },
            required: ['nodeId'],
            additionalProperties: false,
          },

          annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: false,
          },

          async execute({ nodeId }) {
            if (typeof nodeId !== 'string') {
              return 'A valid nodeId is required.';
            }

            const node = currentPipeline.nodes.find((item) => item.id === nodeId);
            if (!node) {
              return `Pipeline node not found: ${nodeId}`;
            }

            const existingIds = new Set(currentPipeline.nodes.map((item) => item.id));
            const baseId = `${node.id}-copy`;
            let cloneId = baseId;
            let suffix = 2;

            while (existingIds.has(cloneId)) {
              cloneId = `${baseId}-${suffix++}`;
            }

            const clone = {
              ...node,
              id: cloneId,
              position: {
                x: node.position.x + 540,
                y: node.position.y + 40,
              },
              data: { ...node.data },
              selected: true,
            };
            const nodes = [...currentPipeline.nodes, clone];
            const edges = [...currentPipeline.edges];

            setCurrentPipeline({ ...currentPipeline, nodes, edges, isDirty: true });
            window.dispatchEvent(new CustomEvent('pipeline:graph-updated', {
              detail: { nodes, edges },
            }));

            return `Cloned pipeline node ${nodeId} as ${cloneId}`;
          },
        },
        {
          signal: controller.signal,
        },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error(
            '[WebMCP] Failed to register clone_pipeline_node:',
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
