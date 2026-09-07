import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "labels-catalogue-popover",
  tool: [
    {
      id: 'labeler-drawer',
      side: 'right',
      priority: 500
    }
  ],
  loader: () => import('@/middleware/tools/MixedTools/LabelsCataloguePopover'),
} as ToolMeta;
