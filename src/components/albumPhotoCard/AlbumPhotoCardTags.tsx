import { useTagsStoreSelector } from '@/context/tagsStore';
import { type GalleryPhoto } from '@/lib/galleryData';
import { Box } from '@mui/material';
import {
  useMemo
} from 'react';

interface AlbumPhotoCardTagsProps {
  photo: GalleryPhoto;
}

const tagsSx = {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 2,
  display: 'flex',
  gap: 0.5,
  flexWrap: 'wrap',
  maxWidth: '70%',
  transition: 'bottom 0.15s',
} as const;

const tagSx = {
  color: '#fff',
  px: 1,
  py: 0.5,
  borderRadius: 2,
  fontSize: '0.625rem',
  fontWeight: 500,
} as const;


export default function AlbumPhotoCardTags({
  photo,
}: AlbumPhotoCardTagsProps) {

  const photoTagIds = useTagsStoreSelector(
    (state) =>
      state.taggedPhotos.find((tp) => tp.id === photo.id)?.tags ?? null,
  );

  const tags = useTagsStoreSelector((state) => state.tags);


  const tagsById = useMemo(() => {
    const map = new Map<string, (typeof tags)[number]>();

    for (const tag of tags) {
      map.set(tag.id, tag);
    }

    return map;
  }, [tags]);

  const resolvedTags = useMemo(() => {
    if (!photoTagIds?.length) {
      return [];
    }

    const result = [];

    for (const tagId of photoTagIds) {
      const tag = tagsById.get(tagId);

      if (tag) {
        result.push(tag);
      }
    }

    return result;
  }, [photoTagIds, tagsById]);

  return (
    <>
      {resolvedTags.length > 0 && (
        <Box className="album-photo-tags" sx={tagsSx}>
          {resolvedTags.map((tag) => (
            <Box
              key={tag.id}
              sx={{
                ...tagSx,
                backgroundColor: `${tag.color}BD`,
              }}
            >
              {tag.name}
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
