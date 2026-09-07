import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_IndexerOff } from '@/hooks/remote/useFetch_IndexerOff';
import { useFetch_IndexerStatus } from '@/hooks/remote/useFetch_IndexerStatus';
import { useFetch_TakeoutMetadata } from '@/hooks/remote/useFetch_TakeoutMetadata';
import { Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

function formatElapsed(startedAt: number): string {
  const seconds = Math.floor((Date.now() - startedAt) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    return remainingMinutes
      ? `${hours}h ${remainingMinutes}m ago`
      : `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours
    ? `${days}d ${remainingHours}h ago`
    : `${days}d ago`;
}

export default function IndexerRefresh() {
  const { setSetting } = useSettings();
  const indexing = useSettingsStoreSelector((state) => state.indexing);
  const { forceRefresh } = useFetch_TakeoutMetadata();
  const { fetchStatus } = useFetch_IndexerStatus();
  const { turnOffJob } = useFetch_IndexerOff();
  const indexerStartedAt = useSettingsStoreSelector((state) => state.indexerStartedAt);
  const indexerProgress = useSettingsStoreSelector((state) => state.indexerProgress);

  const [, setElapsedTick] = useState(0);

  const handleGetStatus = useCallback(async () => {
    try {
      const status = await fetchStatus();

      if (status.status === 'running' && status.progress) {
        setSetting((prev) => ({
          ...prev,
          indexerProgress: status.progress,
        }));
      }

      // If the indexer reports it's idle, make sure the UI/job state is turned off
      if (status.status === 'done') {
        try {
          // attempt to inform server to stop job (noop if already stopped)
          await turnOffJob();
        } catch (err) {
          // ignore errors from turnOffJob here
        }

        setSetting((prev) => ({
          ...prev,
          indexing: false,
          loading: false,
          indexerStartedAt: null,
          indexerProgress: status.progress || prev.indexerProgress,
        }));
      }

      console.log('Indexer status:', status);
    } catch (err) {
      console.error(err);
    }
  }, [fetchStatus, setSetting, turnOffJob]);

  useEffect(() => {
    if (!indexing) return;

    const interval = setInterval(() => {
      handleGetStatus();
      setElapsedTick((tick) => tick + 1);
    }, 750);

    return () => {
      clearInterval(interval);
    };
  }, [indexing, handleGetStatus]);

  useEffect(() => {
    if (!indexing) return;

    const interval = setInterval(() => {
      console.log('🔥 Refreshing takeout metadata...');
      forceRefresh();
    }, 10_000);

    return () => {
      clearInterval(interval);
    };
  }, [indexing, forceRefresh]);

  return <>
    {indexerStartedAt !== null && <>
      <Typography variant="caption" color="primary" sx={{ lineHeight: 1 }}>
        {formatElapsed(indexerStartedAt)} {indexerStartedAt && `(${new Date(indexerStartedAt).toLocaleTimeString()})`} | {indexerProgress.done} indexed
      </Typography>
    </>}
  </>
}
