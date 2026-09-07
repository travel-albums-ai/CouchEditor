import { InterfaceMeta } from '@/discovery/registryTypes';
import { Earth } from 'lucide-react';

export const meta = {
  id: 'globe',
  icon: Earth,
  loader: () => import('@/middleware/interface/GlobeDrawer')
} as InterfaceMeta;
