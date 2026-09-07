import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'domCountStatus',
  tool: [{
    id: 'status-bar',
    side: 'right',
    priority: 1100
  }],
  loader: () => import('@/middleware/base/DomCountStatus'),
} as ToolMeta;
