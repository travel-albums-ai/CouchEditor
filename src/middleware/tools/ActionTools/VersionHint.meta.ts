import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "versionHint",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 100000
    },
  ],
  loader: () => import('@/middleware/tools/ActionTools/VersionHint'),
} as ToolMeta;
