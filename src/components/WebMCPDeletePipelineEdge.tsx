import { usePipelineStore } from '@/context/pipelineStore';
import { useEffect } from 'react';
import './webMcpTypes';

export default function WebMCPDeletePipelineEdge() {
  const { currentPipeline, setCurrentPipeline } = usePipelineStore();

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

    document.modelContext
      .registerTool(
        {
          name: 'delete_pipeline_edge',
          title: 'Delete Pipeline Edge',
          description:
            'Delete the edge from one pipeline node to another by their node ids.',
          inputSchema: {
            type: 'object',
            properties: {
              sourceNodeId: {
                type: 'string',
                description: 'The id of the node where the edge starts.',
              },
              targetNodeId: {
                type: 'string',
                description: 'The id of the node where the edge ends.',
              },
            },
            required: ['sourceNodeId', 'targetNodeId'],
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: true,
            openWorldHint: false,
          },
          async execute({ sourceNodeId, targetNodeId }) {
            if (typeof sourceNodeId !== 'string' || !sourceNodeId) {
              return 'A valid sourceNodeId is required.';
            }

            if (typeof targetNodeId !== 'string' || !targetNodeId) {
              return 'A valid targetNodeId is required.';
            }

            const matchingEdges = currentPipeline.edges.filter(
              (edge) => edge.source === sourceNodeId && edge.target === targetNodeId,
            );
            if (matchingEdges.length === 0) {
              return `Pipeline edge not found from ${sourceNodeId} to ${targetNodeId}`;
            }

            const matchingEdgeIds = new Set(matchingEdges.map((edge) => edge.id));
            const nodes = [...currentPipeline.nodes];
            const edges = currentPipeline.edges.filter((edge) => !matchingEdgeIds.has(edge.id));

            setCurrentPipeline({ ...currentPipeline, nodes, edges, isDirty: true });
            window.dispatchEvent(new CustomEvent('pipeline:graph-updated', {
              detail: { nodes, edges },
            }));

            return `Deleted pipeline edge from ${sourceNodeId} to ${targetNodeId}`;
          },
        },
        { signal: controller.signal },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('[WebMCP] Failed to register delete_pipeline_edge:', error);
        }
      });

    return () => controller.abort();
  }, [currentPipeline, setCurrentPipeline]);

  return null;
}
