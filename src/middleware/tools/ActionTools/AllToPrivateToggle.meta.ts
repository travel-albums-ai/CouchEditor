import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "allToPrivateToggle",
  tool: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'left',
      priority: 900,
      visible: (context: any) => context?.selectedPhotos === undefined ? false : context.selectedPhotos === true,
    })),
  ],
  loader: () => import('@/middleware/tools/ActionTools/AllToPrivateToggle'),
} as ToolMeta;
