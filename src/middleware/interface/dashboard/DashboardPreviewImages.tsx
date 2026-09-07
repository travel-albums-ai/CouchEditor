import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { GalleryPhoto } from '@/lib/galleryData';
import { Box } from '@mui/material';
import { useInView } from 'react-intersection-observer';

export default function DashboardPreviewImages({ photos, size = 60, count = 5, sx, eager = false } : { photos: GalleryPhoto[], size?: number, count?: number, sx?: any, eager?: boolean }) {
  const { inView, ref } = useInView();

  return (

    <Box ref={ref} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1, height: size / 0.75, ...sx }}>
      {(inView || eager) && photos
        .filter((_, index) => index < count)
        .map((photo, index) => (
          <Box sx={{ borderLeft: '3px solid', borderColor: 'background.default', width: size, height: size / 0.75, borderRadius: 2, overflow: 'hidden', mr: -2 }} key={photo.id}>
            <AlbumPhotoThumbnailBackgroundNg key={photo.id} photo={photo} width={size} height={size / 0.75} />
          </Box>
        ))}
    </Box>
  );
}
