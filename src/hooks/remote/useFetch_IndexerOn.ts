import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { useCallback } from 'react';

const THUMBNAILS_JOB_URL = `${SERVER_ORIGIN}/on`;

export const useFetch_IndexerOn = () => {
  const turnOnJob = useCallback(async () => {
    const res = await fetch(THUMBNAILS_JOB_URL);

    if (!res.ok) {
      throw new Error('Failed to start indexer');
    }

    return res.json();
  }, []);

  return { turnOnJob };
};
