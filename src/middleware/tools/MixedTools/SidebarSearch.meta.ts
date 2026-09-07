import type { ToolMeta } from '@/discovery/registryTypes';
export const meta = {
  id: "sidebarSearch",
  tool: [
    {
      id: 'sidebar',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/middleware/tools/MixedTools/SidebarSearch'),
} as ToolMeta;
