import { InterfaceMeta } from '@/discovery/registryTypes';
import { GalleryHorizontal } from 'lucide-react';

export const meta = {
  id: 'scroller',
  icon: GalleryHorizontal,
  loader: () => import('@/middleware/interface/ScrollerDrawer')
} as InterfaceMeta;
