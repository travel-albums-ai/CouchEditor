import { usePipelineStore } from '@/context/pipelineStore';
import { pipelineNodeTypes } from '@/pipeline/pipelineConfig';
import { useEffect } from 'react';
import './webMcpTypes';

export default function WebMCPAddPipelineNode() {
  const { currentPipeline, setCurrentPipeline } = usePipelineStore();

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

    document.modelContext
      .registerTool(
        {
          name: 'add_pipeline_node',
          title: 'Add Pipeline Node',
          description:
            'Add a node of the given type to the current pipeline at the supplied x and y position.',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'The pipeline node type to add.',
              },
              x: {
                type: 'number',
                description: 'The x position of the node in the pipeline canvas.',
              },
              y: {
                type: 'number',
                description: 'The y position of the node in the pipeline canvas.',
              },
            },
            required: ['type', 'x', 'y'],
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: false,
          },
          async execute({ type, x, y }) {
            if (typeof type !== 'string' || !(type in pipelineNodeTypes)) {
              return `Unknown pipeline node type: ${String(type)}`;
            }

            if (
              typeof x !== 'number' ||
              !Number.isFinite(x) ||
              typeof y !== 'number' ||
              !Number.isFinite(y)
            ) {
              return 'Finite numeric x and y positions are required.';
            }

            const existingIds = new Set(currentPipeline.nodes.map((node) => node.id));
            const baseId = `${type}-mcp`;
            let nodeId = baseId;
            let suffix = 2;

            while (existingIds.has(nodeId)) {
              nodeId = `${baseId}-${suffix++}`;
            }

            const node = {
              id: nodeId,
              type,
              position: { x, y },
              data: {},
            };
            const nodes = [...currentPipeline.nodes, node];
            const edges = [...currentPipeline.edges];

            setCurrentPipeline({ ...currentPipeline, nodes, edges, isDirty: true });
            window.dispatchEvent(new CustomEvent('pipeline:graph-updated', {
              detail: { nodes, edges },
            }));

            return `Added pipeline node ${nodeId} of type ${type} at (${x}, ${y})`;
          },
        },
        { signal: controller.signal },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('[WebMCP] Failed to register add_pipeline_node:', error);
        }
      });

    return () => controller.abort();
  }, [currentPipeline, setCurrentPipeline]);

  return null;
}
