import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "search-modal",
  tool: [
    {
      id: 'header',
      side: 'left',
      priority: 10
    }
  ],
  loader: () => import('@/middleware/tools/MixedTools/SearchWindow'),
} as ToolMeta;
