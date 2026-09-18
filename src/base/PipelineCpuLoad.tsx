import NewChip from '@/components/NewChip';
import { Box } from '@mui/material';
import { Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type CpuLoadState = 'idle' | 'busy' | 'high';

const SAMPLE_INTERVAL_MS = 1000;
const BENCHMARK_ITERATIONS = 150_000;

function getCpuLoadState(eventLoopDelayMs: number, benchmarkRatio: number): CpuLoadState {
  if (eventLoopDelayMs >= 250 || benchmarkRatio >= 2) {
    return 'high';
  }

  if (eventLoopDelayMs >= 80 || benchmarkRatio >= 1.35) {
    return 'busy';
  }

  return 'idle';
}

export default function PipelineCpuLoad() {
  const [loadState, setLoadState] = useState<CpuLoadState | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    let timeoutId: number | undefined;
    let baselineMs: number | null = null;
    let warmupSamples = 0;
    let nextSampleAt = performance.now() + SAMPLE_INTERVAL_MS;

    const sample = () => {
      const startedAt = performance.now();
      const eventLoopDelayMs = Math.max(0, startedAt - nextSampleAt);

      let checksum = 0;
      const benchmarkStartedAt = performance.now();
      for (let index = 0; index < BENCHMARK_ITERATIONS; index += 1) {
        checksum = Math.imul(checksum + index, 31);
      }
      void checksum;

      const benchmarkMs = performance.now() - benchmarkStartedAt;
      if (baselineMs === null || benchmarkMs < baselineMs) {
        baselineMs = benchmarkMs;
      }

      warmupSamples += 1;
      if (warmupSamples >= 3 && baselineMs !== null) {
        setLoadState(getCpuLoadState(eventLoopDelayMs, benchmarkMs / baselineMs));
      }

      nextSampleAt += SAMPLE_INTERVAL_MS;
      if (nextSampleAt <= performance.now()) {
        nextSampleAt = performance.now() + SAMPLE_INTERVAL_MS;
      }
      timeoutId = window.setTimeout(sample, Math.max(100, nextSampleAt - performance.now()));
    };

    timeoutId = window.setTimeout(sample, SAMPLE_INTERVAL_MS);
    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const statusKey = loadState === null ? 'pipelineCpuLoadIdle' : `pipelineCpuLoad${loadState[0].toUpperCase()}${loadState.slice(1)}`;
  const isElevated = loadState === 'busy' || loadState === 'high';

  return (
    <Box
      id="pipeline-cpu-load-status"
      sx={loadState === 'high' ? { color: 'error.main' } : loadState === 'busy' ? { color: 'warning.main' } : undefined}
    >
      <NewChip
        icon={<Cpu />}
        count={t('pipelineCpuLoadName')}
        label={t(statusKey)}
        variant={isElevated ? 'important' : 'text'}
        fontSize={14}
        tooltip={t('pipelineCpuLoadTooltip')}
      />
    </Box>
  );
}
