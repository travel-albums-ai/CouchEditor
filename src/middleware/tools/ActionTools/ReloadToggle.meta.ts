import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "reload_toggle",
  tool: [
    {
      id: 'header',
      side: 'left',
      priority: 10
    },
    {
      id: 'indexer',
      side: 'left',
      priority: 10
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/ReloadToggle'),
} as ToolMeta;
