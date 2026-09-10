import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "ToggleToolbox",
  tool: [
    {
      id: 'toolbox',
      side: 'right',
      priority: 0
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/ToggleToolbox'),
} as ToolMeta;
