import { usePipelineStore } from '@/context/pipelineStore';
import { useEffect } from 'react';
import './webMcpTypes';

export default function WebMCPDeletePipelineNode() {
  const { currentPipeline, setCurrentPipeline } = usePipelineStore();

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

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
        { signal: controller.signal },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('[WebMCP] Failed to register delete_pipeline_node:', error);
        }
      });

    return () => controller.abort();
  }, [currentPipeline, setCurrentPipeline]);

  return null;
}
