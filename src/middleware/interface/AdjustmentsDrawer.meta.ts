import { InterfaceMeta } from '@/discovery/registryTypes';
import { PaintRoller } from 'lucide-react';

export const meta = {
  id: 'adjustments',
  icon: PaintRoller,
  loader: () => import('@/middleware/interface/AdjustmentsDrawer')
} as InterfaceMeta;
