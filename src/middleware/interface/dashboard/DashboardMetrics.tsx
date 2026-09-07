import AlbumsMetaDetails from '@/components/AlbumsMetaDetails';
import SettingsSection from '@/components/SettingsSection';
import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import { PersonStanding } from 'lucide-react';

export default function DashboardMetrics() {
  const rawPhotos = useUnfilteredPhotos_GLOBAL();
  const photos = rawPhotos || []

  return (
    <SettingsSection title="Metrics" icon={<PersonStanding />} >
      <AlbumsMetaDetails id="database-counts" photos={photos} minWidth={50} />
    </SettingsSection>
  );
}
