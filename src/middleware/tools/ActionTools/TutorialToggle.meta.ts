import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "tutorial",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 800
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/TutorialToggle'),
} as ToolMeta;
