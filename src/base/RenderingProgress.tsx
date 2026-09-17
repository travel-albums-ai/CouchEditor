import { usePipelineStore } from '@/context/pipelineStore';
import PipelineStageProgress from '@/pipeline/components/PipelineStageProgress';
import {
  Box
} from '@mui/material';
import type { Edge, Node } from '@xyflow/react';

function sortNodesByPipelineOrder(nodes: Node[], edges: Edge[]) {
  const nodeOrder = new Map(nodes.map((node, index) => [node.id, index]));
  const indegree = new Map(nodes.map((node) => [node.id, 0]));
  const downstream = new Map<string, string[]>();

  for (const edge of edges) {
    if (!indegree.has(edge.source) || !indegree.has(edge.target)) continue;

    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
    downstream.set(edge.source, [
      ...(downstream.get(edge.source) ?? []),
      edge.target,
    ]);
  }

  const ready = nodes
    .filter((node) => indegree.get(node.id) === 0)
    .map((node) => node.id);
  const orderedIds: string[] = [];

  while (ready.length > 0) {
    ready.sort((left, right) => (nodeOrder.get(left) ?? 0) - (nodeOrder.get(right) ?? 0));
    const nodeId = ready.shift();
    if (!nodeId) continue;

    orderedIds.push(nodeId);

    for (const downstreamId of downstream.get(nodeId) ?? []) {
      const nextIndegree = (indegree.get(downstreamId) ?? 0) - 1;
      indegree.set(downstreamId, nextIndegree);
      if (nextIndegree === 0) ready.push(downstreamId);
    }
  }

  // Keep cyclic or otherwise invalid graph data visible rather than dropping it.
  const orderedIdSet = new Set(orderedIds);
  orderedIds.push(...nodes.filter((node) => !orderedIdSet.has(node.id)).map((node) => node.id));

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  return orderedIds.flatMap((nodeId) => {
    const node = nodesById.get(nodeId);
    return node ? [node] : [];
  });
}

export default function RenderingProgress() {
  const {
    currentPipeline,
  } = usePipelineStore();

  const orderedNodes = currentPipeline
    ? sortNodesByPipelineOrder(currentPipeline.nodes, currentPipeline.edges)
    : [];

  if (orderedNodes.length === 0) return null;

  return <>
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, p: 0, justifyContent: 'space-between', flex: 1 }}>
      {orderedNodes.map(node => (
        <PipelineStageProgress nodeId={node.id} nodeType={node.type} key={node.id} />
      ))}
    </Box>

  </>
}
