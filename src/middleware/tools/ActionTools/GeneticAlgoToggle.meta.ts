import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "geneticAlgoToggle",
  tool: [
    {
      id: 'adjustments-drawer',
      side: 'right',
      priority: 0
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/GeneticAlgoToggle'),
} as ToolMeta;
