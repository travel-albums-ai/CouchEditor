import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "selectMode",
  tool: [
    {
      id: 'selected-photos-drawer',
      side: 'left',
      priority: 100
    },
    {
      id: 'scroller-drawer',
      side: 'left',
      priority: 200
    },
    {
      id: 'rows-drawer',
      side: 'left',
      priority: 300
    },
    {
      id: 'calendar-drawer',
      side: 'left',
      priority: 400
    },
  ],
  loader: () => import('@/middleware/tools/ActionTools/SelectModeToggle'),
}  as ToolMeta;
