import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useFavorites } from '@/context/favoritesStore';
import { useSelected_isSelected } from '@/context/selectedStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useTagsStoreSelector } from '@/context/tagsStore';
import { type GalleryPhoto } from '@/lib/galleryData';
import AlbumPhotoRowItem from '@/middleware/interface/rows/AlbumPhotoRowItem';
import { Box, useTheme } from '@mui/material';
import { CaseUpper, Clock, Eye, Folder, Hash, MessageCircle, SeparatorHorizontal, SeparatorVertical, ThumbsUp } from 'lucide-react';
import { useCallback, useMemo } from 'react';

interface AlbumPhotoCardProps {
  photo: GalleryPhoto
}

function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation();
}


export default function AlbumPhotoRow({ photo }: AlbumPhotoCardProps) {
  const theme = useTheme();

  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);

  const isPreviewed = useSettingsStoreSelector((state) => state.previewPhotoObj?.id === photo.id);
  const selectMode = useSettingsStoreSelector((state) => state.selectMode);
  const { setPreviewPhotoObj } = useSettings();
  const { isFavorite } = useFavorites();
  const favorite = isFavorite(photo.id);
  const isSelected = useSelected_isSelected(photo.id);

  const photoTagIds = useTagsStoreSelector(
    (state) => state.taggedPhotos.find((tp) => tp.id === photo.id)?.tags
  );
  const tags = useTagsStoreSelector((state) => state.tags);

  const resolvedTags = useMemo(() => {
    if (!photoTagIds || photoTagIds.length === 0) return [];
    return photoTagIds
      .map((tagId) => tags.find((t) => t.id === tagId))
      .filter((t): t is NonNullable<typeof t> => Boolean(t));
  }, [photoTagIds, tags]);

  const handleClick = useCallback(() => {
    setPreviewPhotoObj(photo);
  }, [photo, setPreviewPhotoObj]);

  const thumbWidth = width / 2;
  const thumbHeight = height / 2;

  const thumbnailStyle = useMemo(() => ({
    border:
        selectMode && isSelected
          ? `3px solid ${theme.palette.success.main}`
          : isPreviewed
            ? `4px solid ${theme.palette.primary.main}`
            : 'none',
    borderRadius: 8,
  }), [
    selectMode,
    isSelected,
    isPreviewed,
    theme.palette.success.main,
    theme.palette.primary.main
  ]);

  const properties = [
    {
      id: 'id',
      icon: <Hash />,
      title: 'id',
      value: String(photo.id),
    },
    {
      id: 'folder',
      icon: <Folder />,
      title: 'folder',
      value: String(photo.folder),
    },
    {
      id: 'title',
      icon: <CaseUpper />,
      title: 'title',
      value: String(photo.title),
    },
    {
      id: 'width',
      icon: <SeparatorVertical />,
      title: 'width',
      value: String(photo.width),
    },
    {
      id: 'height',
      icon: <SeparatorHorizontal />,
      title: 'height',
      value: String(photo.height),
    },
    {
      id: 'takenAtTs',
      icon: <Clock />,
      title: 'taken at',
      value: String(photo.takenAt),
    },
    {
      id: 'views',
      icon: <Eye />,
      title: 'views',
      value: String(photo.views),
    },
    {
      id: 'likes',
      icon: <ThumbsUp />,
      title: 'likes',
      value: String(photo.likes),
    },
    {
      id: 'comments',
      icon: <MessageCircle />,
      title: 'comments',
      value: String(photo.comments),
    },
  ];

  return (
    <Box data-photo-id={photo.id}
      onClick={handleClick}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.25s',
        overflow: 'hidden',
        p: 0.75,
        pb: 1.25,
        gap: 2,
        mb: 0.5,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <Box sx={{ width: `${thumbWidth}px`, height: `${thumbHeight}px`, flexShrink: 0, position: 'relative' }}>
        <AlbumPhotoThumbnailBackgroundNg
          photo={photo}
          width={thumbWidth}
          height={thumbHeight}
          style={{...thumbnailStyle}}
        />

        <Box sx={{ position: 'absolute', top: 0, right: 0, left: 0, height: '40px', zIndex: 2 }}>
          <GeneralRegistryToolbar group={'album-photo-row'} context={{ photoId: photo.id, favorite, selectMode }} />
        </Box>
      </Box>

      <Box sx={{
        display: 'grid',
        flex: 1,
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 0,
        opacity: 0.5,
        overflow: 'hidden',
        transition: 'all 0.25s',
        '&:hover': {
          opacity: 1,
        },
      }}>
        {properties.map((prop) => <AlbumPhotoRowItem key={prop.id} icon={prop.icon} title={prop.title} value={prop.value} />)}
      </Box>

      <Box sx={{ flex: '0 0 20%', p: 1, border: '1px dotted', borderColor: 'divider', borderRadius: 1, alignSelf: 'stretch' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
          {resolvedTags.map((tag) => (
            <Box key={tag.id} sx={{
              backgroundColor: `${tag.color}BD`, color: '#fff', px: 1, py: 0.5,
              borderRadius: 2, fontSize: '0.625rem', fontWeight: 500,
            }}>
              {tag.name}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
