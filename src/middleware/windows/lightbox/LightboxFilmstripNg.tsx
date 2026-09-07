import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { Box } from '@mui/material';

type FilmstripProps = {
  photos: any[];
  currentIndex: number;
  goTo: (index: number) => void;
};

const SLOT_SIZE = 158;
const BASE_SIZE = 150;
const VISIBLE_RADIUS = 6;

function getThumbnailScale(distance: number) {
  const d = Math.abs(distance);

  if (d === 0) return 1.28;
  if (d === 1) return 1.08;
  if (d === 2) return 1.0;
  if (d === 3) return 0.94;
  if (d === 4) return 0.88;
  if (d === 5) return 0.82;

  return 0.76;
}

function getThumbnailOpacity(distance: number) {
  const d = Math.abs(distance);

  if (d === 0) return 1;
  if (d === 1) return 0.72;
  if (d === 2) return 0.58;
  if (d === 3) return 0.48;
  if (d === 4) return 0.4;
  if (d === 5) return 0.32;

  return 0.25;
}

export default function LightboxFilmstripNg({
  photos,
  currentIndex,
  goTo,
}: FilmstripProps) {
  if (!photos.length || !photos[currentIndex]) {
    return null;
  }

  const start = Math.max(0, currentIndex - VISIBLE_RADIUS);
  const end = Math.min(
    photos.length,
    currentIndex + VISIBLE_RADIUS + 1,
  );

  const visiblePhotos = photos.slice(start, end);

  return (
    <Box
      sx={{
        position: 'relative',
        width: `${SLOT_SIZE * (VISIBLE_RADIUS * 2 + 1)}px`,
        height: `${BASE_SIZE * 1.28}px`,
        overflow: 'visible',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      {visiblePhotos.map((photo, visibleIndex) => {
        const index = start + visibleIndex;
        const distance = index - currentIndex;
        const active = distance === 0;

        const scale = getThumbnailScale(distance);
        const opacity = getThumbnailOpacity(distance);

        return (
          <Box
            key={photo.id}
            onClick={() => goTo(index)}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',

              width: `${BASE_SIZE}px`,
              height: `${BASE_SIZE}px`,

              transform: `
                translate(
                  calc(-50% + ${distance * SLOT_SIZE}px),
                  -50%
                )
                scale(${scale})
              `,

              transformOrigin: 'center center',

              borderRadius: '12px',
              overflow: 'hidden',
              boxSizing: 'border-box',

              cursor: 'pointer',
              pointerEvents: 'auto',

              opacity,
              filter: active ? 'none' : 'grayscale(70%)',

              border: '2px solid',
              borderColor: active
                ? 'primary.main'
                : 'transparent',

              zIndex: active ? 10 : 5 - Math.abs(distance),

              boxShadow: active
                ? '0 5px 20px rgba(0, 0, 0, 0.45)'
                : '0 2px 8px rgba(0, 0, 0, 0.3)',

              transition: [
                'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                'opacity 320ms ease',
                'filter 320ms ease',
                'border-color 320ms ease',
                'box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1)',
              ].join(', '),

              '&:hover': {
                opacity: 1,
                filter: 'none',

                transform: `
                  translate(
                    calc(-50% + ${distance * SLOT_SIZE}px),
                    -50%
                  )
                  scale(${scale * (active ? 1.03 : 1.04)})
                `,

                boxShadow: '0 6px 22px rgba(0, 0, 0, 0.5)',
                zIndex: 20,
              },
            }}
          >
            <AlbumPhotoThumbnailBackgroundNg
              photo={photo}
              original={false}
              style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius: 10,
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
