import SolidChip from '@/components/SolidChip';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PipelineTimingDetail = {
  durationMs: number;
};

export default function PipelineTotalTimeStatus() {
  const [durationMs, setDurationMs] = useState<number | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const handleTiming = (event: Event) => {
      const { durationMs: nextDurationMs } =
        (event as CustomEvent<PipelineTimingDetail>).detail;

      if (typeof nextDurationMs === 'number') {
        setDurationMs(nextDurationMs)
      }
    }

    window.addEventListener('pipeline:total-timing', handleTiming)
    return () => window.removeEventListener('pipeline:total-timing', handleTiming)
  }, [])

  return (
    <SolidChip
      count={durationMs === null ? '--' : durationMs.toFixed(1)}
      label="ms"
      variant="text"
      minWidth={80}
      tooltip={t('pipelineTotalTimeTooltip')}
    />
  )
}
