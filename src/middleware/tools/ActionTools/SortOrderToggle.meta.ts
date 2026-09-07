import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "sort-order-toggle",
  tool: [
    {
      id: 'selected-photos-drawer',
      side: 'left',
      priority: 0
    },
    {
      id: 'scroller-drawer',
      side: 'left',
      priority: 0
    },
    {
      id: 'rows-drawer',
      side: 'left',
      priority: 0
    },
    {
      id: 'calendar-drawer',
      side: 'left',
      priority: 0
    },
  ],
  loader: () => import('@/middleware/tools/ActionTools/SortOrderToggle'),
} as ToolMeta;
