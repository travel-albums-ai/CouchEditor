import { InterfaceMeta } from '@/discovery/registryTypes';
import { PanelTopBottomDashed } from 'lucide-react';

export const meta = {
  id: 'outlet',
  icon: PanelTopBottomDashed,
  loader: () => import('@/middleware/interface/OutletDrawer')
} as InterfaceMeta;
