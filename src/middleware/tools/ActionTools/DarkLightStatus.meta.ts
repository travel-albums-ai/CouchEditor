import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "darkLightStatus",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 600
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/DarkLightStatus'),
} as ToolMeta;
