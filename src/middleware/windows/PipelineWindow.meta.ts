import { WindowMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'pipeline',
  loader: () => import('@/middleware/windows/PipelineWindow'),
  enabled: true
} as WindowMeta;
