import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';

import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import AlbumPhotoRow from '@/middleware/interface/rows/AlbumPhotoRow';

type Props = {
  photos: GalleryPhoto[];
};

const GRID_STYLE = {
  height: '100%',
  overflowX: 'visible',
} as const;

const SimpleList = ({ style, children, ...props }: any) => (
  <Box
    {...props}
    style={style}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      py: 1,
    }}
  >
    {children}
  </Box>
);

const VISIBILITY_MARGIN = 24;

function isVisibleInScroller(element: HTMLElement, scroller: HTMLElement) {
  const elRect = element.getBoundingClientRect();
  const containerRect = scroller.getBoundingClientRect();

  return (
    elRect.top >= containerRect.top - VISIBILITY_MARGIN &&
    elRect.bottom <= containerRect.bottom + VISIBILITY_MARGIN
  );
}

export default function AllPhotosRowsVirtuoso({ photos }: Props) {
  const height = useAlbumPhotoCardStoreSelector((s) => s.height);
  const previewPhotoObj = useSettingsStoreSelector((s) => s.previewPhotoObj);
  const raf = useRef<number | null>(null);
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const scrollerRef = useRef<HTMLElement | null>(null);

  const photoIndex = useMemo(() => {
    const map = new Map<string, number>();

    photos.forEach((photo, index) => {
      map.set(photo.id, index);
    });

    return map;
  }, [photos]);

  useEffect(() => {
    if (!previewPhotoObj) return;

    if (raf.current) {
      cancelAnimationFrame(raf.current);
    }

    raf.current = requestAnimationFrame(() => {
      const index = photoIndex.get(previewPhotoObj.id);
      if (index == null) return;

      const scroller = scrollerRef.current;
      const element = scroller?.querySelector<HTMLElement>(
        `[data-photo-id="${previewPhotoObj.id}"]`
      );

      if (element && scroller) {
        if (isVisibleInScroller(element, scroller)) return;

        element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }

      virtuosoRef.current?.scrollToIndex({
        index,
        align: 'center',
        behavior: 'smooth',
      });
    });

    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, [previewPhotoObj, photoIndex]);

  const itemContent = useCallback(
    (index: number) => {
      const photo = photos[index];
      if (!photo) return null;

      return <AlbumPhotoRow photo={photo} />;
    },
    [photos]
  );

  return (
    <VirtuosoGrid
      ref={virtuosoRef}
      scrollerRef={(ref) => {
        scrollerRef.current = (ref as HTMLElement) ?? null;
      }}
      style={GRID_STYLE}
      totalCount={photos.length}
      computeItemKey={(index) => photos[index]?.id ?? index}
      increaseViewportBy={{
        top: height * 5,
        bottom: height * 5,
      }}
      components={{ List: SimpleList }}
      itemContent={itemContent}
    />
  );
}
