import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "allToTagsToggle",
  tool: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'left',
      priority: 1000,
      visible: (context: any) => context?.selectedPhotos === undefined ? false : context.selectedPhotos === true,
    })),
  ],
  loader: () => import('@/middleware/tools/ActionTools/AllToTagsToggle'),
} as ToolMeta;
