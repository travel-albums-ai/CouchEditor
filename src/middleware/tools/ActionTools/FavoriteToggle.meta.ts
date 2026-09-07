import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "favoriteToggle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 100
    },
    {
      id: 'album-photo-card',
      side: 'right',
      priority: 0,
      visible: (context: any) => context?.favorite === undefined ? false : context.favorite === true,
    },
    {
      id: 'album-photo-row',
      side: 'right',
      priority: 0,
      visible: (context: any) => context?.favorite === undefined ? false : context.favorite === true,
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/FavoriteToggle'),
} as ToolMeta;
