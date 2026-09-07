import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "themeMenu",
  tool: [
    // {
    //   id: 'header',
    //   side: 'right',
    //   priority: 1000
    // }
  ],
  loader: () => import('@/middleware/tools/PopoverTools/ThemeMenu'),
} as ToolMeta;
