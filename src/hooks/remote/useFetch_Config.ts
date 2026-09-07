import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { useQuery } from '@tanstack/react-query';

const TAKEOUT_METADATA_URL = `${SERVER_ORIGIN}/config`

type ConfigPayload = {
  TAKEOUT_ROOTS?: string[]
  TARGET_ROOT?: string,
  CONCURRENCY: number,
  IMAGE_CONCURRENCY: number,
  THUMBNAIL_SIZE: number,
  THUMBNAIL_QUALITY: number
}

export const useFetch_Config = () => {
  const { data = null, refetch } = useQuery<ConfigPayload>({
    queryKey: ['config'],
    queryFn: () => fetch(TAKEOUT_METADATA_URL).then((res) => res.json()),
  })

  return { data, refetch }
}
