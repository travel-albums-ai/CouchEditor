import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "ignoredToggle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 300
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/IgnoredToggle'),
} as ToolMeta;
