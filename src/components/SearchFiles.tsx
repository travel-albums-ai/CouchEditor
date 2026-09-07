import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import CustomPopoverForTrigger from '@/components/CustomPopoverForTrigger';
import { useDescriptionsStoreSelector } from '@/context/descriptionsStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSettings } from '@/context/settingsStore';
import ElementLabels from '@/middleware/interface/components/ElementLabels';
import {
  Box,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SearchFiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const { setPreviewPhotoObj } = useSettings();
  const photos = useFilteredPhotos_GLOBAL();
  const descriptions = useDescriptionsStoreSelector(state => state.descriptions);
  const { t } = useTranslation();

  const descriptionMap = useMemo(
    () => new Map(descriptions.map(desc => [desc.id, desc.description])),
    [descriptions]
  );

  const term = searchTerm.trim().toLowerCase();

  const photosRelevant = useMemo(() => {
    if (!photos?.length) return [];

    if (!term) return photos.slice(0, 100);

    const result = [];

    for (const photo of photos) {
      const description = descriptionMap.get(photo.id) ?? '';

      if (
        photo.id.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term)
      ) {
        result.push(photo);

        if (result.length === 100) break;
      }
    }

    return result;
  }, [photos, term, descriptionMap]);

  return (
    <CustomPopoverForTrigger
      preOpen
      trigger={
        <TextField
          fullWidth
          size="small"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t('searchFilesPlaceholder')}
          variant="standard"
        />
      }
    >
      <ElementLabels />

      {photosRelevant.length > 0 ? (
        photosRelevant.map(photo => {
          const description = descriptionMap.get(photo.id);

          return (
            <Box
              key={photo.id}
              onClick={() => setPreviewPhotoObj(photo)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  overflow: 'hidden',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlbumPhotoThumbnailBackgroundNg photo={photo} />
              </Box>

              <Typography variant="subtitle2" color="textSecondary">
                {photo.title || photo.id}
              </Typography>

              {description && (
                <Typography variant="caption" color="textSecondary">
                  {description}
                </Typography>
              )}

              <Typography
                variant="caption"
                color="textDisabled"
                align="right"
                sx={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {photo.imageUrl}
              </Typography>
            </Box>
          );
        })
      ) : (
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" color="textSecondary">
            {t('noPhotosFound')}
          </Typography>
        </Box>
      )}
    </CustomPopoverForTrigger>
  );
}
