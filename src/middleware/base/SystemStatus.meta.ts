import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'systemStatus',
  tool: [{
    id: 'status-bar',
    side: 'left',
    priority: 100
  }],
  loader: () => import('@/middleware/base/SystemStatus'),
} as ToolMeta;
