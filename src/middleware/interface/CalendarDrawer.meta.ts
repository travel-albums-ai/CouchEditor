import { InterfaceMeta } from '@/discovery/registryTypes';
import { Calendar } from 'lucide-react';

export const meta = {
  id: 'calendar',
  icon: Calendar,
  loader: () => import('@/middleware/interface/CalendarDrawer')
} as InterfaceMeta;
