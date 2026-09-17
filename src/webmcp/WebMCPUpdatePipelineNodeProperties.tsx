import { usePipelineStore } from '@/context/pipelineStore';
import { paletteItemsByType } from '@/pipeline/NodePalette';
import { useEffect } from 'react';
import './webMcpTypes';

type PropertyValues = Record<string, unknown>;

export default function WebMCPUpdatePipelineNodeProperties() {
  const { currentPipeline, setCurrentPipeline } = usePipelineStore();

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

    document.modelContext
      .registerTool(
        {
          name: 'update_pipeline_node_properties',
          title: 'Update Pipeline Node Properties',
          description:
            'Update exposed numeric properties on a pipeline node. Values must be within the property limits and match its step when one is defined.',
          inputSchema: {
            type: 'object',
            properties: {
              nodeId: {
                type: 'string',
                description: 'The id of the pipeline node to update.',
              },
              values: {
                type: 'object',
                description:
                  'A map of exposed property keys to numeric values. Valid keys and limits depend on the node type.',
                additionalProperties: { type: 'number' },
              },
            },
            required: ['nodeId', 'values'],
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
          },
          async execute({ nodeId, values }) {
            if (typeof nodeId !== 'string' || !nodeId) {
              return 'A valid nodeId is required.';
            }

            if (!values || typeof values !== 'object' || Array.isArray(values)) {
              return 'values must be an object containing numeric property values.';
            }

            const node = currentPipeline.nodes.find((item) => item.id === nodeId);
            if (!node) {
              return `Pipeline node not found: ${nodeId}`;
            }

            const configs = paletteItemsByType[node.type ?? '']?.configs ?? [];
            const configsByKey = new Map(configs.map((config) => [config.key, config]));
            const propertyValues = values as PropertyValues;
            const updates: Record<string, number> = {};

            for (const [key, value] of Object.entries(propertyValues)) {
              const config = configsByKey.get(key);

              if (!config) {
                return `Property "${key}" is not exposed by node ${nodeId}.`;
              }

              if (typeof value !== 'number' || !Number.isFinite(value)) {
                return `Property "${key}" must be a finite number.`;
              }

              if (value < config.min || value > config.max) {
                return `Property "${key}" must be between ${config.min} and ${config.max}.`;
              }

              if (config.step) {
                const steps = (value - config.min) / config.step;
                if (Math.abs(steps - Math.round(steps)) > Number.EPSILON * 10) {
                  return `Property "${key}" must use increments of ${config.step}.`;
                }
              }

              updates[key] = value;
            }

            const nodes = currentPipeline.nodes.map((item) =>
              item.id === nodeId
                ? { ...item, data: { ...item.data, ...updates } }
                : item,
            );
            const edges = [...currentPipeline.edges];

            setCurrentPipeline({ ...currentPipeline, nodes, edges, isDirty: true });
            window.dispatchEvent(new CustomEvent('pipeline:graph-updated', {
              detail: { nodes, edges },
            }));

            return `Updated properties on pipeline node ${nodeId}: ${Object.keys(updates).join(', ')}`;
          },
        },
        { signal: controller.signal },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('[WebMCP] Failed to register update_pipeline_node_properties:', error);
        }
      });

    return () => controller.abort();
  }, [currentPipeline, setCurrentPipeline]);

  return null;
}
