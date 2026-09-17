import { Box, LinearProgress, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';

type StageTimingDetail = {
  nodeId: string;
  durationMs: number;
};

type PipelineStageTimingProps = {
  nodeId: string;
  nodeType: string;
  isBusy?: (busy: boolean) => void;
};

export default function PipelineStageProgress({
  nodeId,
  nodeType,
  isBusy,
}: PipelineStageTimingProps) {
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const startedEventName = `${nodeType}:stageStarted`;
    const timingEventName = `${nodeType}:stageTiming`;
    const handleStarted = (event: Event) => {
      const { nodeId: startedNodeId } =
        (event as CustomEvent<{ nodeId: string }>).detail;

      if (startedNodeId === nodeId) {
        setIsProcessing(true);
        isBusy?.(true)
      }
    };
    const handleTiming = (event: Event) => {
      const { nodeId: timingNodeId, durationMs: nextDurationMs } =
        (event as CustomEvent<StageTimingDetail>).detail;

      if (timingNodeId === nodeId) {
        setIsProcessing(false);
        isBusy?.(false);
        setDurationMs(nextDurationMs);
      }
    };

    window.addEventListener(startedEventName, handleStarted);
    window.addEventListener(timingEventName, handleTiming);
    return () => {
      window.removeEventListener(startedEventName, handleStarted);
      window.removeEventListener(timingEventName, handleTiming);
    };
  }, [nodeId, nodeType]);

  return <Box sx={{ flex: 1 }}>
    <Tooltip title={isProcessing ? nodeType + ' - Processing...' : `${nodeType} - Last duration: ${Math.round(durationMs * 100) / 100 / 1000 ?? 0} s`} arrow placement="top">
      <LinearProgress
        variant={isProcessing ? 'indeterminate' : 'determinate'}
        value={100}
        sx={{ height: 4, borderRadius: 1, opacity: isProcessing ? 1 : 0.4 }}
      />
    </Tooltip>
  </Box>;
}
