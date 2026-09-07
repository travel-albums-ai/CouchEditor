import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { useCallback } from 'react';

const THUMBNAILS_JOB_URL = `${SERVER_ORIGIN}/status`;

export const useFetch_IndexerStatus = () => {
  const fetchStatus = useCallback(async () => {
    const res = await fetch(THUMBNAILS_JOB_URL);

    if (!res.ok) {
      throw new Error('Failed to fetch indexer status');
    }

    return res.json();
  }, []);

  return { fetchStatus };
};
