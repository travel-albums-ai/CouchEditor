import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import SettingsSection from '@/components/SettingsSection';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { Box } from '@mui/material';
import { Clock } from 'lucide-react';

export default function DashboardMostRecent() {
  const photos = useFilteredPhotos_GLOBAL();

  return (
    <SettingsSection title="Most Recent" icon={<Clock />} guidance={`Last 20 photos`} >
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: 2, flexWrap: 'wrap', height: '100%' }}>
        {photos?.slice(0, 20).map((item) => (
          <Box key={item.title} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ width: '100px', height: '100px', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              <AlbumPhotoThumbnailBackgroundNg photo={item} width={100} height={100} />
            </Box>
          </Box>
        ))}
      </Box>
    </SettingsSection>
  );
}
