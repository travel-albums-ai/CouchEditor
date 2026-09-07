import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "sortSectionsToggle",
  tool: [
    {
      id: 'sidebar',
      side: 'right',
      priority: 0,
      visible: (context: any) => !context.sidebarSearchOpen,
    }
  ],
  loader: () => import('@/middleware/tools/PopoverTools/SortSectionsToggle'),
} as ToolMeta;
