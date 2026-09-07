import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "searchFiltersToggle",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 200,
      // visible: (context: any) => !context.sidebarSearchOpen,
    }
  ],
  loader: () => import('@/middleware/tools/PopoverTools/SearchFiltersToggle'),
} as ToolMeta;
