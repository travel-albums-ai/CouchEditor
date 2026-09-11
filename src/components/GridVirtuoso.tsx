import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { ImageValue } from '@/middleware/windows/pipeline/types';
import { Box } from '@mui/material';
import { useCallback, useMemo, useRef } from 'react';
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';

type Props = {
  photos: ImageValue[];
  width?: number;
  height?: number;
};

const GRID_STYLE = { height: '100%', overflowX: 'visible', borderRadius: '8px' } as const;

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

export default function GridVirtuoso({ photos }: Props) {
  const width = 300;
  const height = 300;
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);

  const itemContent = useCallback(
    (index: number) => {
      const photo = photos[index];
      if (!photo) return null;

      return (
        <AlbumPhotoThumbnailBackgroundNg
          key={index}
          photo={{ name: photo?.name, src: photo?.src} as ImageValue}
          style={{
            display: 'block',
            width: '100%',
            height: '300px',
            objectFit: 'contain',
            borderRadius: '8px',
            padding: '1px',
          }}
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
