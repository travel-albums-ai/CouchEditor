import type { ToolMeta } from '@/discovery/toolRegistry';

export const meta = {
  id: "previewPhotoTitle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 500
    }
  ],
  loader: () => import('@/middleware/tools/MixedTools/PreviewPhotoTitle'),
} as ToolMeta;
