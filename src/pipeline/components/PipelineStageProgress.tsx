import { Box, LinearProgress, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';

type StageTimingDetail = {
  nodeId: string;
  durationMs: number;
};

type StageProgressDetail = {
  nodeId: string;
  completed: number;
  total: number;
};

type PipelineStageTimingProps = {
  nodeId: string;
  nodeType: string;
  isBusy?: (busy: boolean) => void;
  onProgress?: (nodeId: string, progress: number) => void;
};

export default function PipelineStageProgress({
  nodeId,
  nodeType,
  isBusy,
  onProgress,
}: PipelineStageTimingProps) {
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedEventName = `${nodeType}:stageStarted`;
    const timingEventName = `${nodeType}:stageTiming`;
    const progressEventName = `${nodeType}:progress`;
    const evaluationStartedEventName = 'pipeline:evaluationStarted';
    const handleEvaluationStarted = () => {
      setIsProcessing(false);
      setProgress(0);
      onProgress?.(nodeId, 0);
      isBusy?.(false);
    };
    const handleStarted = (event: Event) => {
      const { nodeId: startedNodeId } =
        (event as CustomEvent<{ nodeId: string }>).detail;

      if (startedNodeId === nodeId) {
        setIsProcessing(true);
        setProgress(0);
        onProgress?.(nodeId, 0);
        isBusy?.(true);
      }
    };
    const handleProgress = (event: Event) => {
      const detail = (event as CustomEvent<StageProgressDetail>).detail;

      if (detail.nodeId !== nodeId) return;

      const nextProgress = detail.total > 0
        ? Math.min(1, Math.max(0, detail.completed / detail.total))
        : 0;
      setProgress(nextProgress);
      onProgress?.(nodeId, nextProgress);
    };
    const handleTiming = (event: Event) => {
      const { nodeId: timingNodeId, durationMs: nextDurationMs } =
        (event as CustomEvent<StageTimingDetail>).detail;

      if (timingNodeId === nodeId) {
        setIsProcessing(false);
        isBusy?.(false);
        setDurationMs(nextDurationMs);
        setProgress(1);
        onProgress?.(nodeId, 1);
      }
    };

    window.addEventListener(startedEventName, handleStarted);
    window.addEventListener(timingEventName, handleTiming);
    window.addEventListener(progressEventName, handleProgress);
    window.addEventListener(evaluationStartedEventName, handleEvaluationStarted);
    return () => {
      window.removeEventListener(startedEventName, handleStarted);
      window.removeEventListener(timingEventName, handleTiming);
      window.removeEventListener(progressEventName, handleProgress);
      window.removeEventListener(evaluationStartedEventName, handleEvaluationStarted);
    };
  }, [nodeId, nodeType, onProgress]);

  const displayDuration = durationMs === null ? '--' : (durationMs / 1000).toFixed(2);

  return <Box sx={{ flex: 1 }}>
    <Tooltip title={isProcessing ? nodeType + ' - Processing...' : `${nodeType} - Last duration: ${displayDuration} s`} arrow placement="top">
      <LinearProgress
        variant="determinate"
        value={progress * 100}
        sx={{ height: 8, borderRadius: 1, opacity: isProcessing ? 1 : 0.4 }}
      />
    </Tooltip>
  </Box>;
}
