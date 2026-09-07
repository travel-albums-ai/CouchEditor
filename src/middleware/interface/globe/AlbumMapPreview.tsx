import AlbumPhotoCard from '@/components/AlbumPhotoCard';
import { GalleryPhoto } from '@/lib/galleryData';
import { Box } from '@mui/material';
import { Fragment, useEffect, useRef } from 'react';

type Props = {
  batches: any[];
  previewPhotoId?: string | number | null;
  width: number;
  height: number;
  onPreview: (photo: GalleryPhoto) => void;
};

export default function AlbumMapPreview({ batches, previewPhotoId, width, height, onPreview }: Props) {
  const thumbnailRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!previewPhotoId) return;

    const selected = thumbnailRefs.current[String(previewPhotoId)];

    if (selected) {
      selected.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [previewPhotoId]);

  if (!batches || batches.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 1,
        display: 'flex',
        gap: 1,
        flexWrap: 'nowrap',
        alignItems: 'flex-end',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollBehavior: 'smooth',
        zIndex: 999,

        '&::-webkit-scrollbar': {
          height: 8,
        },
      }}
    >
      {batches.map((batch: any) => (
        <Fragment key={batch.batchName}>
          {batch.photos.map((p: any) => {
            const selected = previewPhotoId === p.id;

            return (
              <Box
                key={p.id}
                ref={(el) => {
                  thumbnailRefs.current[p.id] = el;
                }}
                sx={{
                  flexShrink: 0,
                  boxShadow: selected ? 4 : 2,
                  borderRadius: 1,
                  lineHeight: 0,
                  cursor: 'pointer',
                  border: selected ? '2px solid' : '1px solid',
                  borderColor: (theme) =>
                    selected
                      ? theme.palette.primary.main
                      : theme.palette.divider,
                  transition: 'all 1s ease',
                }}
              >
                <AlbumPhotoCard original={false} photo={p}
                  style={{
                    width: selected ? width : width / 2,
                    // height: selected ? height : height / 2,
                    minHeight: selected ? height : height / 2,
                    objectFit: 'cover',
                    borderRadius: 4,
                    lineHeight: 0,
                    // transition: 'all 0.3s ease',
                    display: 'block',
                    userSelect: 'none',
                  }}
                />
              </Box>
            );
          })}
        </Fragment>
      ))}
    </Box>
  );
}
