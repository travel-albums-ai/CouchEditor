import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "PerformanceToggle",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 600
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/PerformanceToggle'),
} as ToolMeta;
