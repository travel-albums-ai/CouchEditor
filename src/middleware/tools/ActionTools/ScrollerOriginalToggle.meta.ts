import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "scroller-original-toggle",
  tool: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 1100
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/ScrollerOriginalToggle'),
} as ToolMeta;
