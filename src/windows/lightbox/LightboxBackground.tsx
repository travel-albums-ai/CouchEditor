import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { Box } from '@mui/material';

type ViewerProps = {
  photo: any;
};

export default function LightboxBackground({ photo }: ViewerProps) {
  if (!photo) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.5,
        filter: 'blur(16px) saturate(1.75) opacity(0.45)',
        borderRadius: 16,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <AlbumPhotoThumbnailBackgroundNg
        key={photo.id ?? photo.path}
        photo={photo}
        original={true}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
}
