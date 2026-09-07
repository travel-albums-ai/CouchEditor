import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "allToIgnoreToggle",
  tool: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'left',
      priority: 800,
      visible: (context: any) => context?.selectedPhotos === undefined ? false : context.selectedPhotos === true,
    })),
  ],
  loader: () => import('@/middleware/tools/ActionTools/AllToIgnoreToggle'),
} as ToolMeta;
