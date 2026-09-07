import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'keyboardMenu',
  tool: [{
    id: 'status-bar',
    side: 'right',
    priority: 500
  }],
  loader: () => import('@/middleware/base/KeyboardMenu'),
} as ToolMeta;
