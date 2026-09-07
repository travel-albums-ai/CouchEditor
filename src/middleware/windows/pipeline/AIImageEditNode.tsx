import { useBYOKStoreSelector } from '@/context/byokStore';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { Alert, Box, Button, LinearProgress, Typography } from '@mui/material';
import type { Node, NodeProps } from "@xyflow/react";
import { Astroid, Sparkles } from 'lucide-react';
import { useEffect, useState } from "react";

export type AIImageEditNodeConfig = {
  // Must match the nodeDefinitions key in pipeline.worker.ts, which is
  // also used as the progress event name prefix ("<type>:progress").
  type: string;
  title: string;
  actionLabel: string;
};

type Progress = { runId: number; completed: number; total: number };

// Builds a node component sharing the same passthru/apiKey sync and
// progress-bar wiring, used by the AI Colorizer and AI Denoiser nodes.
export function createAIImageEditNode(config: AIImageEditNodeConfig) {
  function AIImageEditNode({
    id,
    data,
  }: NodeProps<Node<{ passthru?: boolean; apiKey?: string }>>) {
    const byokOpenAIKey = useBYOKStoreSelector((state) => state.byokOpenAIKey);

    const [engaged, setEngaged] = useState(data.passthru === false);
    const [progress, setProgress] = useState<Progress | null>(null);

    // Mutate data in place (like the slider/selection nodes) so the pipeline
    // engine always reads the latest value, even from a listener bound this render.
    useEffect(() => {
      data.apiKey = byokOpenAIKey;
      data.passthru = !engaged;

      window.dispatchEvent(new CustomEvent("pipeline:changed"));
    }, [data, byokOpenAIKey, engaged]);

    // Progress is posted by the pipeline worker and relayed by
    // pipelineWorkerClient as a global event, since the worker has no
    // direct handle back to this component.
    useEffect(() => {
      const handler = (event: Event) => {
        const detail = (event as CustomEvent<
          { nodeId: string } & Progress
        >).detail;

        if (!detail || detail.nodeId !== id) return;

        setProgress((current) => {
          // Ignore updates from a run that's since been superseded.
          if (current && detail.runId < current.runId) return current;
          return detail;
        });
      };

      window.addEventListener(`${config.type}:progress`, handler);

      return () => {
        window.removeEventListener(`${config.type}:progress`, handler);
      };
    }, [id]);

    const percent =
      progress && progress.total > 0
        ? Math.min(100, (progress.completed / progress.total) * 100)
        : 0;

    return (<>
      <InputHandle id="image" />
      <NodeWrapper title={config.title} icon={<Astroid />} toolbar={<></>} type={config.type}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant={engaged ? 'contained' : 'outlined'}
            size="small"
            startIcon={<Sparkles size={14} />}
            onClick={() => setEngaged((current) => !current)}
          >
            {engaged ? 'Engaged' : 'Passthru'}
          </Button>
        </Box>

        {engaged && !byokOpenAIKey && (
          <Alert severity="warning" sx={{ py: 0, mt: 1 }}>
            No OpenAI key configured
          </Alert>
        )}

        {engaged && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
            <LinearProgress variant="determinate" value={percent} />
            <Typography variant="caption" color="textSecondary">
              {progress
                ? `${progress.completed}/${progress.total} ${config.actionLabel}`
                : 'Idle'}
            </Typography>
          </Box>
        )}
      </NodeWrapper>
      <OutputHandle id="image" />
    </>);
  }

  return AIImageEditNode;
}
