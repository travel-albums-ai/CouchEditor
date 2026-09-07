import { Box, Typography } from '@mui/material';
import { memo, useMemo } from 'react';

import AlbumPhotoCard from '@/components/AlbumPhotoCard';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryPhoto } from '@/lib/galleryData';

type Props = {
  photos: GalleryPhoto[];
  rows?: number;
  columns?: number;
  offset: number;
};

const ITEM = 300;

function AlbumScrollerItem({ photos, rows = 2, columns = 3, offset }: Props) {
  const groupedByBatches = useSettingsStoreSelector((state) => state.scrollerGroupedByBatches)
  const scrollerOriginal = useSettingsStoreSelector((state) => state.scrollerOriginal)
  const isActive = Math.abs(offset) < 0.5;
  const blockWidth = ITEM * columns;

  const style = useMemo(
    () => ({
      flex: '0 0 auto' as const,
      width: blockWidth,
      borderRadius: 2,
      overflow: 'hidden' as const,
      display: 'grid' as const,
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: 1,
      zIndex: isActive ? 1 : 0,
      transform: `scale(${isActive ? 1.5 : 0.75}) translateX(${offset * 120}px)`,
      opacity: isActive ? 1 : 0.1,
      willChange: 'transform, opacity',
      transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease',
    }),
    [blockWidth, columns, rows, isActive, offset]
  );

  return <>
    <Box sx={style}>
      {isActive && groupedByBatches && <Box sx={{ gridColumn: `1 / span ${columns}`, gridRow: `1 / span ${rows}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <Typography>~{photos[0]?.takenAt}</Typography>
      </Box>}
      {photos?.map((photo) => (
        <Box key={photo.id}>
          <AlbumPhotoCard original={scrollerOriginal} photo={photo} />
        </Box>
      ))}
    </Box>
  </>;
}

function areEqual(prev: Props, next: Props) {
  return (
    prev.photos === next.photos &&
    prev.rows === next.rows &&
    prev.columns === next.columns &&
    prev.offset === next.offset
  );
}

export default memo(AlbumScrollerItem, areEqual);
