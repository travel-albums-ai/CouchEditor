import NewChip from '@/components/NewChip';
import { Box, Skeleton, Tooltip } from '@mui/material';
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

  const displayInSeconds = durationMs === null ? '--' : (durationMs / 1000).toFixed(2);

  return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {isProcessing && <Box sx={{ opacity: 0.1 }}>
      <Skeleton variant="rounded" width={100} sx={{ bgcolor: 'primary.main', borderRadius: 2 }} height={32} />
    </Box>}
    {!isProcessing && <Tooltip title={`Time taken to process: ${displayInSeconds} s`}>
      <span>
        <NewChip
          fontSize={18}
          sx={{ width: '100px'}}
          count={displayInSeconds}
          icon={<Timer size={16} />}
          borderless/>
      </span>
    </Tooltip>}
  </Box>;
}
