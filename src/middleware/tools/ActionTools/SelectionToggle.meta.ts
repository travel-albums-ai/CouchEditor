import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "selectionMode",
  tool: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'left',
      priority: 300,
      visible: (context) => context?.selectMode === undefined ? false : context.selectMode === true,
    })),
  ],
  loader: () => import('@/middleware/tools/ActionTools/SelectionToggle'),
} as ToolMeta;
