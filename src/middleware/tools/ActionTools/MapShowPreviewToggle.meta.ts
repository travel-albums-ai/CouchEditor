import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "mapShowPreview",
  tool: [
    {
      id: 'globe-drawer',
      side: 'right',
      priority: 300
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/MapShowPreviewToggle'),
} as ToolMeta;
