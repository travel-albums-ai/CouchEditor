import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "byok-openai-field",
  tool: [
    // {
    //   id: 'auto-description-drawer',
    //   side: 'left',
    //   priority: 0
    // }
  ],
  loader: () => import('@/middleware/tools/MixedTools/BYOKOpenAiField'),
} as ToolMeta;
