import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { Box } from '@mui/material';

type FilmstripProps = {
  photos: any[];
  currentIndex: number;
  goTo: (index: number) => void;
  width: number;
  height: number;
};

export default function LightboxFilmstrip({ photos, currentIndex, goTo, width, height }: FilmstripProps) {
  const previousPhotos = photos.slice(Math.max(0, currentIndex - 5), currentIndex);
  const nextPhotos = photos.slice(currentIndex + 1, currentIndex + 6);

  const thumbWidth = Math.max(72, Math.min(120, width / 9));
  const thumbHeight = Math.max(56, Math.min(90, height / 7));

  const renderThumbnail = (photo: any, index: number) => {
    const active = index === currentIndex;

    return (
      <Box
        key={photo.id}
        onClick={() => goTo(index)}
        sx={{
          flex: '0 0 auto',
          height: '150px',
          width: '150px',
          borderRadius: 4,
          overflow: 'hidden',
          cursor: 'pointer',
          opacity: active ? 1 : 0.5,
          filter: active ? 'none' : 'grayscale(75%)',
          border: '2px solid',
          borderColor: active ? 'primary.main' : 'transparent',
          transition: 'opacity 120ms ease, border-color 120ms ease, transform 120ms ease',
          '&:hover': {
            opacity: 1,
            transform: 'scale(1.04)',
            filter: 'none',
          },
        }}
      >
        <AlbumPhotoThumbnailBackgroundNg
          photo={photo}
          original={false}
          style={{
            zIndex: 1,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: 16,
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.5)',
          }}
        />
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, overflow: 'hidden', minHeight: thumbHeight + 12 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden', minWidth: 0 }}>
        {previousPhotos.map(photo => {
          const index = photos.findIndex(p => p.id === photo.id);
          return renderThumbnail(photo, index);
        })}
      </Box>

      <Box sx={{ flex: '0 0 auto' }}>{renderThumbnail(photos[currentIndex], currentIndex)}</Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden', minWidth: 0 }}>
        {nextPhotos.map(photo => {
          const index = photos.findIndex(p => p.id === photo.id);
          return renderThumbnail(photo, index);
        })}
      </Box>
    </Box>
  );
}
