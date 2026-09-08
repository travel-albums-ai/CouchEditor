import SolidChip from '@/components/SolidChip';
import { useEffect, useState } from 'react';

type StageTimingDetail = {
  nodeId: string;
  durationMs: number;
};

type PipelineStageTimingProps = {
  nodeId: string;
  nodeType: string;
};

export default function PipelineStageTiming({
  nodeId,
  nodeType,
}: PipelineStageTimingProps) {
  const [durationMs, setDurationMs] = useState<number | null>(null);

  useEffect(() => {
    const eventName = `${nodeType}:stageTiming`;
    const handleTiming = (event: Event) => {
      const { nodeId: timingNodeId, durationMs: nextDurationMs } =
        (event as CustomEvent<StageTimingDetail>).detail;

      if (timingNodeId === nodeId) {
        setDurationMs(nextDurationMs);
      }
    };

    window.addEventListener(eventName, handleTiming);
    return () => window.removeEventListener(eventName, handleTiming);
  }, [nodeId, nodeType]);

  return <>
    <SolidChip count={durationMs === null ? '--' : durationMs.toFixed(1)} label="ms" minWidth={70} />
  </>;
}
