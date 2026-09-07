import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "previewMapToggle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'right',
      priority: 0
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/PreviewMapToggle'),
} as ToolMeta;
