import { usePipelineStore } from '@/context/pipelineStore';
import { useEffect } from 'react';
import './webMcpTypes';

export default function WebMCPClonePipelineNode() {
  const { currentPipeline, setCurrentPipeline } = usePipelineStore();

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

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
        { signal: controller.signal },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('[WebMCP] Failed to register clone_pipeline_node:', error);
        }
      });

    return () => controller.abort();
  }, [currentPipeline, setCurrentPipeline]);

  return null;
}
