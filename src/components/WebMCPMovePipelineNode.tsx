import { usePipelineStore } from '@/context/pipelineStore';
import { useEffect } from 'react';
import './webMcpTypes';

type NodePosition = {
  x: number;
  y: number;
};

function isNodePosition(value: unknown): value is NodePosition {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const position = value as Record<string, unknown>;
  return (
    typeof position.x === 'number' &&
    Number.isFinite(position.x) &&
    typeof position.y === 'number' &&
    Number.isFinite(position.y)
  );
}

export default function WebMCPMovePipelineNode() {
  const { currentPipeline, setCurrentPipeline } = usePipelineStore();

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

    document.modelContext
      .registerTool(
        {
          name: 'move_pipeline_node',
          title: 'Move Pipeline Node',
          description:
            'Move a node in the current pipeline from its given position to another position.',
          inputSchema: {
            type: 'object',
            properties: {
              nodeId: {
                type: 'string',
                description: 'The id of the pipeline node to move.',
              },
              fromPosition: {
                type: 'object',
                description: 'The node position before the move.',
                properties: {
                  x: { type: 'number' },
                  y: { type: 'number' },
                },
                required: ['x', 'y'],
                additionalProperties: false,
              },
              toPosition: {
                type: 'object',
                description: 'The node position after the move.',
                properties: {
                  x: { type: 'number' },
                  y: { type: 'number' },
                },
                required: ['x', 'y'],
                additionalProperties: false,
              },
            },
            required: ['nodeId', 'fromPosition', 'toPosition'],
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
          },
          async execute({ nodeId, fromPosition, toPosition }) {
            if (typeof nodeId !== 'string' || !nodeId) {
              return 'A valid nodeId is required.';
            }

            if (!isNodePosition(fromPosition) || !isNodePosition(toPosition)) {
              return 'Finite numeric x and y values are required for fromPosition and toPosition.';
            }

            const node = currentPipeline.nodes.find((item) => item.id === nodeId);
            if (!node) {
              return `Pipeline node not found: ${nodeId}`;
            }

            if (node.position.x !== fromPosition.x || node.position.y !== fromPosition.y) {
              return `Pipeline node ${nodeId} is not at the supplied fromPosition.`;
            }

            const nodes = currentPipeline.nodes.map((item) =>
              item.id === nodeId ? { ...item, position: toPosition } : item,
            );
            const edges = [...currentPipeline.edges];

            setCurrentPipeline({ ...currentPipeline, nodes, edges, isDirty: true });
            window.dispatchEvent(new CustomEvent('pipeline:graph-updated', {
              detail: { nodes, edges },
            }));

            return `Moved pipeline node ${nodeId} from (${fromPosition.x}, ${fromPosition.y}) to (${toPosition.x}, ${toPosition.y})`;
          },
        },
        { signal: controller.signal },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('[WebMCP] Failed to register move_pipeline_node:', error);
        }
      });

    return () => controller.abort();
  }, [currentPipeline, setCurrentPipeline]);

  return null;
}
