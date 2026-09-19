import NewChip from '@/components/NewChip';
import { clearPipelineCaches } from '@/pipeline/pipelineWorkerClient';
import { IconButton, Tooltip } from '@mui/material';
import { Eraser, MemoryStick } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type CacheMemoryDetail = {
  bytes?: number;
  inputBytes?: number;
};

function formatMegabytes(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export default function PipelineCacheMemory() {
  const [cacheBytes, setCacheBytes] = useState(0);
  const [inputBytes, setInputBytes] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const handleMemory = (event: Event) => {
      const nextBytes = (event as CustomEvent<CacheMemoryDetail>).detail?.bytes;

      if (typeof nextBytes === 'number' && Number.isFinite(nextBytes)) {
        setCacheBytes(Math.max(0, nextBytes));
      }
    };

    const handleInputMemory = (event: Event) => {
      const nextBytes = (event as CustomEvent<CacheMemoryDetail>).detail?.inputBytes;

      if (typeof nextBytes === 'number' && Number.isFinite(nextBytes)) {
        setInputBytes(Math.max(0, nextBytes));
      }
    };

    window.addEventListener('pipeline:cache-memory', handleMemory);
    window.addEventListener('pipeline:input-memory', handleInputMemory);
    return () => {
      window.removeEventListener('pipeline:cache-memory', handleMemory);
      window.removeEventListener('pipeline:input-memory', handleInputMemory);
    };
  }, []);

  return (
    <>
      <NewChip
        sx={{ minWidth: 110 }}
        icon={<MemoryStick />}
        count={formatMegabytes(cacheBytes + inputBytes)}
        label="MB"
        variant="text"
        fontSize={14}
        tooltip={t('pipelineCacheMemoryTooltip')}
      />
      <Tooltip title={t('pipelineClearCachesTooltip')} placement="top" arrow>
        <IconButton
          aria-label={t('pipelineClearCachesTooltip')}
          size="small"
          onClick={clearPipelineCaches}
        >
          <Eraser size={14} />
        </IconButton>
      </Tooltip>
    </>
  );
}
