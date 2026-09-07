import { InterfaceMeta } from '@/discovery/registryTypes';
import { FileSearch } from 'lucide-react';

export const meta = {
  id: 'sidebar',
  icon: FileSearch,
  loader: () => import('@/middleware/interface/SidebarDrawer')
} as InterfaceMeta;
