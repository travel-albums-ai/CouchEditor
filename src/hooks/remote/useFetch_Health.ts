import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { useQuery } from '@tanstack/react-query';

const HEALTH_URL = `${SERVER_ORIGIN}/health`;

export const useFetch_Health = () => {
  return useQuery<unknown, unknown>({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch(HEALTH_URL, {
        signal: AbortSignal.timeout(1500),
      });

      if (!res.ok) throw new Error(res.statusText);

      return res.json();
    },
    retry: false,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
};
