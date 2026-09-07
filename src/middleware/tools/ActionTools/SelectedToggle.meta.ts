import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "selectedToggle",
  tool: [
    {
      id: 'album-photo-card',
      side: 'left',
      priority: 0,
      visible: (context: any) => context?.selectMode === undefined ? false : context.selectMode === true,
    },
    {
      id: 'album-photo-row',
      side: 'left',
      priority: 0,
      visible: (context: any) => context?.selectMode === undefined ? false : context.selectMode === true,
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/SelectedToggle'),
} as ToolMeta;
