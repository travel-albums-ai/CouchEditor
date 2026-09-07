import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "narrowMap",
  tool: [
    {
      id: 'globe-drawer',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/NarrowMapToggle'),
} as ToolMeta;
