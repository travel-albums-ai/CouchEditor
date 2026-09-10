import SolidChip from '@/components/SolidChip';
import { Box, Skeleton } from '@mui/material';
import { Timer } from 'lucide-react';
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

export default function PipelineStageTiming({
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

  return <Box>
    {isProcessing && <Box sx={{ opacity: 0.1 }}>
      <Skeleton variant="rounded" width={64} sx={{ bgcolor: 'primary.main' }} height={24} />
    </Box>}
    {!isProcessing && <SolidChip count={durationMs === null ? '--' : durationMs.toFixed(1)} height={24} minWidth={64} icon={<Timer size={16} />} fontSize={11} variant="header" borderless/>}
  </Box>;
}
