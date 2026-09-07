import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "settingsModalToggle",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 500
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/SettingsWindowToggle'),
} as ToolMeta;
