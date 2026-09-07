import { InterfaceMeta } from '@/discovery/registryTypes';
import { LayoutList } from 'lucide-react';

export const meta = {
  id: 'rows',
  icon: LayoutList,
  loader: () => import('@/middleware/interface/RowsDrawer')
} as InterfaceMeta;
