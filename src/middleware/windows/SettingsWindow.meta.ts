import { WindowMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'settings',
  loader: () => import('@/middleware/windows/SettingsWindow'),
  enabled: true
} as WindowMeta;
