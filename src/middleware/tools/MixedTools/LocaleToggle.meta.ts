import { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "localeToggle",
  tool: [

  ],
  loader: () => import('@/middleware/tools/MixedTools/LocaleToggle'),
} as ToolMeta;
