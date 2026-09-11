import { useBYOKStoreSelector } from '@/context/byokStore';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Alert, Box, Button, LinearProgress, Typography } from '@mui/material';
import type { Node, NodeProps } from "@xyflow/react";
import { Astroid, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';

export type AIImageEditNodeConfig = {
  // Must match the nodeDefinitions key in pipeline.worker.ts, which is
  // also used as the progress event name prefix ("<type>:progress").
  type: string;
  titleKey: string;
  actionLabelKey: string;
};

type Progress = { runId: number; completed: number; total: number };
type Preview = { src: string; width: number; height: number; name?: string };

// Builds a node component sharing the same passthru/apiKey sync and
// progress-bar wiring, used by the AI Colorizer and AI Denoiser nodes.
export function createAIImageEditNode(config: AIImageEditNodeConfig) {
  function AIImageEditNode({
    id,
    data,
  }: NodeProps<Node<{ passthru?: boolean; apiKey?: string }>>) {
    const byokOpenAIKey = useBYOKStoreSelector((state) => state.byokOpenAIKey);
    const { t } = useTranslation();

    const [engaged, setEngaged] = useState(data.passthru === false);
    const [progress, setProgress] = useState<Progress | null>(null);
    const [preview, setPreview] = useState<Preview | null>(null);
    const latestRunId = useRef(0);
    const previewUrl = useRef<string | null>(null);

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
          { nodeId: string; preview?: Preview } & Progress
        >).detail;

        if (!detail || detail.nodeId !== id) return;
        if (detail.runId < latestRunId.current) return;

        if (detail.runId > latestRunId.current) {
          latestRunId.current = detail.runId;
          if (previewUrl.current) {
            URL.revokeObjectURL(previewUrl.current);
            previewUrl.current = null;
          }
          setPreview(null);
        }

        if (detail.preview) {
          if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
          previewUrl.current = detail.preview.src;
          setPreview(detail.preview);
        }

        setProgress((current) => {
          // Ignore updates from a run that's since been superseded.
          if (current && detail.runId < current.runId) return current;
          return detail;
        });
      };

      window.addEventListener(`${config.type}:progress`, handler);

      return () => {
        window.removeEventListener(`${config.type}:progress`, handler);
        if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      };
    }, [id]);

    const percent =
      progress && progress.total > 0
        ? Math.min(100, (progress.completed / progress.total) * 100)
        : 0;

    return (<>
      <InputHandle id="image" />
      <NodeWrapper title={t(config.titleKey)} icon={<Astroid />} toolbar={<></>} type={config.type}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant={engaged ? 'contained' : 'outlined'}
            size="small"
            startIcon={<Sparkles size={14} />}
            onClick={() => setEngaged((current) => !current)}
          >
            {engaged ? t('aiEngaged') : t('aiPassthru')}
          </Button>
        </Box>

        {engaged && !byokOpenAIKey && (
          <Alert severity="warning" sx={{ py: 0, mt: 1 }}>
            {t('aiNoOpenAiKey')}
          </Alert>
        )}

        {engaged && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            {preview && (
              <Box
                component="img"
                src={preview.src}
                alt={preview.name ?? t(config.actionLabelKey)}
                sx={{
                  display: 'block',
                  width: '100%',
                  maxHeight: 220,
                  objectFit: 'contain',
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                }}
              />
            )}
            <LinearProgress variant="determinate" value={percent} />
            <Typography variant="caption" color="textSecondary">
              {progress
                ? `${progress.completed}/${progress.total} ${t(config.actionLabelKey)}`
                : t('aiIdle')}
            </Typography>
          </Box>
        )}
      </NodeWrapper>
      <OutputHandle id="image" />
    </>);
  }

  return AIImageEditNode;
}
