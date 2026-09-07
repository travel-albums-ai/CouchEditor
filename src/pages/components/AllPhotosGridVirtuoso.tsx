import { Box } from '@mui/material';
import { useCallback, useMemo, useRef } from 'react';
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';

import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { GalleryPhoto } from '@/lib/galleryData';
import AlbumPhotoCard from '../../components/AlbumPhotoCard';

type Props = {
  photos: GalleryPhoto[];
  width?: number;
  height?: number;
};

const GRID_STYLE = { height: '100%', overflowX: 'visible', borderRadius: '8px' } as const;
const CARD_STYLE = { gridColumn: 'span 1', gridRow: 'span 1' } as const;

const GridList = ({ style, children, width, gap, ...props }: any) => {
  return (
    <Box
      {...props}
      style={style}
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${width}px, 1fr))`,
        gap,
        py: 1,
        alignContent: 'start',
      }}
    >
      {children}
    </Box>
  );
};

export default function AllPhotosGridVirtuoso({ photos, width: propWidth, height: propHeight }: Props) {
  const width = propWidth ?? useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = propHeight ?? useAlbumPhotoCardStoreSelector((state) => state.height);
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  // const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)

  // const photosRef = useRef(photos);
  // photosRef.current = photos;

  // useEffect(() => {
  //   if (!previewPhotoObj) return;
  //   const index = photosRef.current.findIndex((p) => p.id === previewPhotoObj.id);
  //   if (index >= 0) {
  //     virtuosoRef.current?.scrollToIndex({ index, align: 'center', behavior: 'auto' });
  //   }
  // }, [previewPhotoObj]);


  const itemContent = useCallback(
    (index: number) => {
      const photo = photos[index];
      if (!photo) return null;

      return (
        <AlbumPhotoCard
          photo={photo}
          style={CARD_STYLE}
        />
      );
    },
    [photos]
  );

  const List = useMemo(() => {
    const Comp = (props: any) => <GridList {...props} width={width} gap={1} />;
    return Comp;
  }, [width]);

  return (
    <VirtuosoGrid
      ref={virtuosoRef}
      increaseViewportBy={{ top: height * 3, bottom: height * 6 }}
      overscan={{ main: height * 2, reverse: height * 2 }}
      style={GRID_STYLE}
      totalCount={photos.length}
      computeItemKey={(index) => photos[index]?.id ?? index}
      components={{ List }}
      itemContent={itemContent}
    />
  );
}
