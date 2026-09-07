import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "extendedMenu",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 1000
    }
  ],
  loader: () => import('@/middleware/tools/PopoverTools/ExtendedMenu'),
} as ToolMeta;
