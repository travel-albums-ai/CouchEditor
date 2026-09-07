import { InterfaceMeta } from '@/discovery/registryTypes';
import { Astroid } from 'lucide-react';

export const meta = {
  id: 'autoDescription',
  icon: Astroid,
  loader: () => import('@/middleware/interface/AutoDescriptionDrawer')
} as InterfaceMeta;
