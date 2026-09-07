import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "allToFavoriteToggle",
  tool: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'left',
      priority: 700,
      visible: (context: any) => context?.selectedPhotos === undefined ? false : context.selectedPhotos === true,
    })),
  ],
  loader: () => import('@/middleware/tools/ActionTools/AllToFavoriteToggle'),
} as ToolMeta;
