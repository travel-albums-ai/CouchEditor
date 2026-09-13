import { usePipelineStore } from '@/context/pipelineStore';
import { addEdge } from '@xyflow/react';
import { useEffect } from 'react';
import './webMcpTypes';

export default function WebMCPConnectPipelineNodes() {
  const { currentPipeline, setCurrentPipeline } = usePipelineStore();

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

    document.modelContext
      .registerTool(
        {
          name: 'connect_pipeline_nodes',
          title: 'Connect Pipeline Nodes',
          description:
            'Connect two nodes in the current pipeline with an edge. Both handles default to image.',
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
              sourceHandle: {
                type: 'string',
                description:
                  'Optional id of the source handle. Defaults to image.',
              },
              targetHandle: {
                type: 'string',
                description:
                  'Optional id of the target handle. Defaults to image.',
              },
            },
            required: ['sourceNodeId', 'targetNodeId'],
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
          },
          async execute({ sourceNodeId, targetNodeId, sourceHandle, targetHandle }) {
            if (typeof sourceNodeId !== 'string' || !sourceNodeId) {
              return 'A valid sourceNodeId is required.';
            }

            if (typeof targetNodeId !== 'string' || !targetNodeId) {
              return 'A valid targetNodeId is required.';
            }

            if (sourceHandle !== undefined && (typeof sourceHandle !== 'string' || !sourceHandle)) {
              return 'sourceHandle must be a non-empty string when provided.';
            }

            if (targetHandle !== undefined && (typeof targetHandle !== 'string' || !targetHandle)) {
              return 'targetHandle must be a non-empty string when provided.';
            }

            if (sourceNodeId === targetNodeId) {
              return 'Source and target node ids must be different.';
            }

            const nodeIds = new Set(currentPipeline.nodes.map((node) => node.id));
            if (!nodeIds.has(sourceNodeId)) {
              return `Source pipeline node not found: ${sourceNodeId}`;
            }

            if (!nodeIds.has(targetNodeId)) {
              return `Target pipeline node not found: ${targetNodeId}`;
            }

            const edges = addEdge(
              {
                source: sourceNodeId,
                target: targetNodeId,
                sourceHandle: sourceHandle ?? 'image',
                targetHandle: targetHandle ?? 'image',
              },
              currentPipeline.edges,
            );

            if (edges.length === currentPipeline.edges.length) {
              return `Pipeline edge already exists from ${sourceNodeId} to ${targetNodeId}`;
            }

            const nodes = [...currentPipeline.nodes];
            setCurrentPipeline({ ...currentPipeline, nodes, edges, isDirty: true });
            window.dispatchEvent(new CustomEvent('pipeline:graph-updated', {
              detail: { nodes, edges },
            }));

            return `Connected pipeline nodes ${sourceNodeId} -> ${targetNodeId}`;
          },
        },
        { signal: controller.signal },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('[WebMCP] Failed to register connect_pipeline_nodes:', error);
        }
      });

    return () => controller.abort();
  }, [currentPipeline, setCurrentPipeline]);

  return null;
}
