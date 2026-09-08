import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'pipelineNodeCountStatus',
  tool: [{
    id: 'status-bar',
    side: 'left',
    priority: 10
  }],
  loader: () => import('@/middleware/base/PipelineNodeCountStatus'),
} as ToolMeta;
