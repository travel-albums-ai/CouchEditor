import RGBHistogram from '@/components/Histogram';
import PhotoExifComplete from '@/components/PhotoExifComplete';
import PhotoExifDetails from '@/components/PhotoExifDetails';
import SettingsSection from '@/components/SettingsSection';
import { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';
import { Box } from '@mui/material';
import { Camera } from 'lucide-react';

export default function EXIFSection({ photo }: { photo: GalleryPhoto }) {
  if (!photo) return null;

  return (
    <SettingsSection title="EXIF" icon={<Camera />} gap={1} divider={false} transparent={true}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <PhotoExifDetails photo={photo} />
          <RGBHistogram imageUrl={composeUrl(photo)} width={100} height={50} />
        </Box>
        <Box sx={{ height: '350px', overflowY: 'auto', overflowX: 'hidden', width: '100%', borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 2 }}>
          <PhotoExifComplete photo={photo} />
        </Box>
      </Box>
    </SettingsSection>
  );
}
