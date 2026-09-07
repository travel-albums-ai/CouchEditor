import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { useCallback } from 'react';

const THUMBNAILS_JOB_URL = `${SERVER_ORIGIN}/off`;

export const useFetch_IndexerOff = () => {
  const turnOffJob = useCallback(async () => {
    const res = await fetch(THUMBNAILS_JOB_URL);

    if (!res.ok) {
      throw new Error('Failed to stop indexer');
    }

    return res.json();
  }, []);

  return { turnOffJob };
};
