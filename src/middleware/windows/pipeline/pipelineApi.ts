import type { Edge, Node } from '@xyflow/react';

import { prepareGraph, type PipelineGraph } from '@/context/pipelineStore';
import { PIPELINE_FILE_EXTENSION } from './pipelineConfig';

type ImportedPipeline = PipelineGraph & { name?: unknown };

export function isPipelineGraph(value: unknown): value is ImportedPipeline {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as { nodes?: unknown; edges?: unknown };
  return Array.isArray(candidate.nodes) && Array.isArray(candidate.edges);
}

export function getPipelineName(name: string | undefined, fallback: string): string {
  return name?.trim() || fallback.replace(/\.cep$/i, '') || 'Untitled pipeline';
}

export function downloadPipelineFile(name: string, nodes: Node[], edges: Edge[]): void {
  const pipeline = {
    name,
    ...prepareGraph({ nodes, edges }),
  };
  const blob = new Blob([JSON.stringify(pipeline, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name.replace(/[\\/:*?"<>|]+/g, '_')}${PIPELINE_FILE_EXTENSION}`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function readPipelineFile(file: File): Promise<{ name: string; graph: PipelineGraph }> {
  if (!file.name.toLowerCase().endsWith(PIPELINE_FILE_EXTENSION)) {
    throw new Error('Invalid pipeline extension');
  }

  const imported = JSON.parse(await file.text()) as unknown;

  if (!isPipelineGraph(imported)) {
    throw new Error('Invalid pipeline format');
  }

  return {
    name: getPipelineName(
      typeof imported.name === 'string' ? imported.name : undefined,
      file.name,
    ),
    graph: {
      nodes: imported.nodes,
      edges: imported.edges,
    },
  };
}
