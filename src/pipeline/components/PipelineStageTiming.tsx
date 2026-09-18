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
  const [elapsedMs, setElapsedMs] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  useEffect(() => {
    const startedEventName = `${nodeType}:stageStarted`;
    const timingEventName = `${nodeType}:stageTiming`;

    const handleStarted = (event: Event) => {
      const { nodeId: startedNodeId } =
      (event as CustomEvent<{ nodeId: string }>).detail;

      if (startedNodeId === nodeId) {
        setIsProcessing(true);
        setStartedAt(performance.now());
        setElapsedMs(0);
        isBusy?.(true);
      }
    };

    const handleTiming = (event: Event) => {
      const { nodeId: timingNodeId, durationMs: nextDurationMs } =
      (event as CustomEvent<StageTimingDetail>).detail;

      if (timingNodeId === nodeId) {
        setIsProcessing(false);
        setStartedAt(null);
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

  useEffect(() => {
    if (!isProcessing || startedAt === null) return;

    const interval = setInterval(() => {
      setElapsedMs(performance.now() - startedAt);
    }, 50);

    return () => clearInterval(interval);
  }, [isProcessing, startedAt]);

  const displayInSeconds = durationMs === null ? '--' : (durationMs / 1000).toFixed(2);

  return <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    {isProcessing && (
      <Box sx={{ position: 'relative', width: 100, height: 32 }}>
        <Skeleton
          variant="rounded"
          width={100}
          height={32}
          sx={{
            position: 'absolute',
            inset: 0,
            // bgcolor: 'primary.main',
            borderRadius: 2,
            opacity: 0.1,
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
          {Math.round(elapsedMs)} ms
        </Box>
      </Box>
    )}
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
