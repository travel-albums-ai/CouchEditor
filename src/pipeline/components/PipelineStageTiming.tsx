import NewChip from '@/components/NewChip';
import { Box, LinearProgress, Tooltip, Typography } from '@mui/material';
import { Timer } from 'lucide-react';
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
};

export default function PipelineStageTiming({
  nodeId,
  nodeType,
  isBusy,
}: PipelineStageTimingProps) {
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [progress, setProgress] = useState<StageProgressDetail | null>(null);

  useEffect(() => {
    const startedEventName = `${nodeType}:stageStarted`;
    const timingEventName = `${nodeType}:stageTiming`;
    const progressEventName = `${nodeType}:progress`;

    const handleStarted = (event: Event) => {
      const { nodeId: startedNodeId } =
      (event as CustomEvent<{ nodeId: string }>).detail;

      if (startedNodeId === nodeId) {
        setIsProcessing(true);
        setStartedAt(performance.now());
        setElapsedMs(0);
        setProgress(null);
        isBusy?.(true);
      }
    };

    const handleProgress = (event: Event) => {
      const detail = (event as CustomEvent<StageProgressDetail>).detail;

      if (detail.nodeId === nodeId) setProgress(detail);
    };

    const handleTiming = (event: Event) => {
      const { nodeId: timingNodeId, durationMs: nextDurationMs } =
      (event as CustomEvent<StageTimingDetail>).detail;

      if (timingNodeId === nodeId) {
        setIsProcessing(false);
        setStartedAt(null);
        isBusy?.(false);
        setDurationMs(nextDurationMs);
        setProgress(null);
      }
    };

    window.addEventListener(startedEventName, handleStarted);
    window.addEventListener(timingEventName, handleTiming);
    window.addEventListener(progressEventName, handleProgress);

    return () => {
      window.removeEventListener(startedEventName, handleStarted);
      window.removeEventListener(timingEventName, handleTiming);
      window.removeEventListener(progressEventName, handleProgress);
    };
  }, [nodeId, nodeType]);

  useEffect(() => {
    if (!isProcessing || startedAt === null) return;

    const interval = setInterval(() => {
      setElapsedMs(performance.now() - startedAt);
    }, 50);

    return () => clearInterval(interval);
  }, [isProcessing, startedAt]);

  const displayInSeconds = durationMs === null ? '--' : (durationMs / 1000).toFixed(2);
  const progressPercent = progress && progress.total > 0
    ? Math.min(100, Math.max(0, (progress.completed / progress.total) * 100))
    : 0;

  return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {isProcessing && (
      <Box sx={{ position: 'relative', width: 100, minHeight: 32, display: 'flex', alignItems: 'center' }}>
        {progress && progress.total > 0 ? <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            aria-label={`${progress.completed} of ${progress.total}`}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
            {progress.completed}/{progress.total}
          </Typography>
        </Box> : <>
          <LinearProgress
            variant="indeterminate"
            sx={{
              position: 'absolute',
              inset: 0,
              height: 32,
              borderRadius: 2,
              opacity: 0.2,
            }}
          />

          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {(elapsedMs / 1000).toFixed(2)} s
          </Box>
        </>}
      </Box>
    )}
    {!isProcessing && <Tooltip title={`Time taken to process: ${displayInSeconds} s`}>
      <span>
        <NewChip
          fontSize={18}
          sx={{ width: '100px'}}
          label="s"
          count={displayInSeconds}
          icon={<Timer size={16} />}
          borderless/>
      </span>
    </Tooltip>}
  </Box>;
}
