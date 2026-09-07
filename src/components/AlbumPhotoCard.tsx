import AlbumPhotoCardTags from '@/components/albumPhotoCard/AlbumPhotoCardTags';
import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import AlbumsMetaDetails from '@/components/AlbumsMetaDetails';
import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useDescriptions } from '@/context/descriptionsStore';
import { useFavorites } from '@/context/favoritesStore';
import { useSelected_isSelected } from '@/context/selectedStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { type GalleryPhoto } from '@/lib/galleryData';
import DescribePhotoReadOnly from '@/middleware/interface/preview/DescribePhotoReadOnly';
import AlbumMapPanel from '@/pages/components/AlbumMapPanel';
import { Box, Card, Divider, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { type Theme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { Satellite } from 'lucide-react';
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent
} from 'react';
import { useInView } from 'react-intersection-observer';

interface AlbumPhotoCardProps {
  photo: GalleryPhoto;
  style?: CSSProperties;
  thumbnailSx?: CSSProperties;
  original?: boolean;
  mapHeight?: number;
  mapWidth?: number;
  naked?: boolean;
}

function prettyTime(dateInput: string) {
  const d = dayjs(dateInput);
  const hour = d.hour();

  const partOfDay =
    hour >= 5 && hour < 12
      ? 'Morning'
      : hour < 18
        ? 'Afternoon'
        : hour < 22
          ? 'Evening'
          : 'Night';

  return `${partOfDay}, ${d.format('D MMM YYYY')}`;
}

const cardSx = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: 2,
  cursor: 'pointer',
  transition: 'filter 0.25s',

  '&:hover': {
    filter: 'saturate(1.25)',
  },
} as const;

const toolbarSx = {
  position: 'absolute',
  top: 4,
  left: 4,
  height: 40,
  zIndex: 2,
} as const;

const detailsSx = {
  position: 'absolute',
  right: 8,
  bottom: 8,
  left: 8,
  borderRadius: 2,
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 1,
  zIndex: 3,
  px: 2,
  py: 0.75,
  bgcolor: (theme: Theme) => `${theme.palette.background.paper}BB`,
} as const;

function AlbumPhotoCard({
  photo,
  style,
  original = false,
  thumbnailSx = {},
  mapHeight,
  mapWidth,
  naked = false,
}: AlbumPhotoCardProps) {
  const theme = useTheme();

  const [isHovered, setIsHovered] = useState(false);
  const [showGps, setShowGps] = useState(false);

  const { hasDescription } = useDescriptions();

  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);
  const showDescription = useAlbumPhotoCardStoreSelector(
    (state) => state.showDescription,
  );
  const showTags = useAlbumPhotoCardStoreSelector((state) => state.showTags);
  const showDate = useAlbumPhotoCardStoreSelector((state) => state.showDate);
  const showLocation = useAlbumPhotoCardStoreSelector(
    (state) => state.showLocation,
  );
  const showFileName = useAlbumPhotoCardStoreSelector(
    (state) => state.showFileName,
  );

  const selectMode = useSettingsStoreSelector((state) => state.selectMode);

  const isPreviewed = useSettingsStoreSelector(
    (state) => state.previewPhotoObj?.id === photo.id,
  );

  const { isFavorite } = useFavorites();

  const { ref, inView } = useInView();

  const favorite = isFavorite(photo.id);
  const isSelected = useSelected_isSelected(photo.id);

  const hasGps =
    Number.isFinite(photo.latitude) &&
    Number.isFinite(photo.longitude) &&
    photo.latitude !== 0 &&
    photo.longitude !== 0;

  const handleMouseEnter = useCallback((event: MouseEvent<HTMLElement>) => {
    setIsHovered(true);
  }, [hasGps, photo.id]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const thumbnailBorder = useMemo(() => {
    if (selectMode && isSelected) {
      return `3px solid ${theme.palette.success.main}`;
    }

    if (isPreviewed) {
      return `4px solid ${theme.palette.primary.main}`;
    }

    return 'none';
  }, [
    isPreviewed,
    isSelected,
    selectMode,
    theme.palette.primary.main,
    theme.palette.success.main,
  ]);

  return (
    <>
      <Card
        ref={ref}
        component="article"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          minHeight: height,
          ...cardSx,

          borderBottomLeftRadius: showFileName ? 0 : 8,
          borderBottomRightRadius: showFileName ? 0 : 8,
          ...style,
        }}
      >
        <AlbumPhotoThumbnailBackgroundNg
          photo={photo}
          width={width}
          height={height}
          original={original}
          style={{
            ...thumbnailSx,
            border: thumbnailBorder,
            borderRadius: 8,
          }}
        />
        {!naked && <>
          {!selectMode && isHovered && hasGps && <Box
            onMouseLeave={() => setShowGps(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              left: 8,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              zIndex: 3,
              px: 0.25,
              py: 0.25,
            }}>
            <GenericToggleButtonGroup variant="outlined" items={[
              {
                tooltip: "Show photo location on map",
                icon: <Satellite size={16} />,
                onClick: () => setShowGps(!showGps),
              },
            ] satisfies GenericToggleButtonProps[]} />



            {showGps && (
              <Box sx={{ width: mapWidth || width * 0.75, height: mapHeight || height * 0.65 }}>
                <AlbumMapPanel photos={[photo]} height={mapHeight || height * 0.65} />
              </Box>
            )}

            {/* {showGps && <Box><AlbumMapPanel photos={[photo]} height={100} /></Box>} */}
          </Box>}
          {inView && (
            <>
              {(selectMode || favorite) && (
                <GeneralRegistryToolbar
                  fullWidth={false}
                  group="album-photo-card"
                  sx={toolbarSx}
                  context={{
                    photoId: photo.id,
                    favorite,
                    selectMode,
                  }}
                />
              )}

              {showTags && <AlbumPhotoCardTags photo={photo} />}

              {showDescription && !isHovered && hasDescription(photo.id) && (
                <DescribePhotoReadOnly
                  photoId={photo.id}
                  className="album-photo-description"
                  sx={detailsSx}
                />
              )}

              {isHovered && (
                <Stack
                  direction="row"
                  divider={
                    <Divider
                      orientation="vertical"
                      sx={{ borderStyle: 'dotted' }}
                      flexItem
                    />
                  }
                  sx={detailsSx}
                >
                  {showDate && (
                    <Tooltip arrow title={photo.takenAt}>
                      <Typography
                        variant="caption"
                        gutterBottom={false}
                        sx={{
                          color: 'text.secondary',
                          opacity: 0.9,
                          fontWeight: 500,
                          lineHeight: 1.5,
                        }}
                      >
                        {prettyTime(photo.takenAt)}
                      </Typography>
                    </Tooltip>
                  )}

                  <AlbumsMetaDetails
                    photos={[photo]}
                    minWidth={0}
                    filterEmpty
                    showCount={false}
                    showLocation={showLocation}
                  />
                </Stack>
              )}
            </>
          )}
        </>}
      </Card>
    </>
  );
}

export default memo(AlbumPhotoCard, (previous, next) => {
  return (
    previous.photo === next.photo &&
    previous.original === next.original &&
    previous.style === next.style
  );
});
