import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'pipelineTotalTimeStatus',
  tool: [{
    id: 'status-bar',
    side: 'left',
    priority: 20
  }],
  loader: () => import('@/middleware/base/PipelineTotalTimeStatus'),
} as ToolMeta;
