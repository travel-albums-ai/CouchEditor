import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "pinned",
  tool: [
    {
      id: 'selected-photos-drawer',
      side: 'left',
      priority: 0,
      visible: (context) => context?.showAll === undefined ? true : context.showAll === false
    },
    {
      id: 'scroller-drawer',
      side: 'left',
      priority: 0,
      visible: (context) => context?.showAll === undefined ? true : context.showAll === false
    },
    {
      id: 'rows-drawer',
      side: 'left',
      priority: 0,
      visible: (context) => context?.showAll === undefined ? true : context.showAll === false
    },
    {
      id: 'calendar-drawer',
      side: 'left',
      priority: 0,
      visible: (context) => context?.showAll === undefined ? true : context.showAll === false
    },
  ],
  loader: () => import('@/middleware/tools/ActionTools/PinnedToggle'),
} as ToolMeta;
