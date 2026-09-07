import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "previewCommentsToggle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'right',
      priority: 200
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/PreviewCommentsToggle'),
} as ToolMeta;
