
import useTransform_Photo2Exif from '@/hooks/useTransform_Photo2Exif';
import { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';

import {
  Alert,
  Box,
  Skeleton,
  Typography
} from '@mui/material';

const splitByCamelCaseAll = (str: string) => {
  return str
    .replace(/([A-Z]{2,4})(?=[A-Z][a-z])/g, '$1 ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
};

export default function PhotoExifComplete({ photo }: { photo?: GalleryPhoto }) {
  const { exif, loading, error } = useTransform_Photo2Exif(composeUrl(photo, true));

  const ignoredKeys = [
    'YCbCrSubSampling', 'YCbCrPositioning', 'XResolution', 'YResolution', 'ResolutionUnit',
    'FNumber', 'ISO', "ExifVersion", "DateTimeOriginal", "ApertureValue", "FocalLength"]

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 1,
          alignItems: 'stretch',
          overflow: 'auto',
        }}
      >
        {loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,

            }}
          >
            {Array.from({ length: 30 }).map((_, index) => (<Box key={index} sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              alignItems: 'center',
              width: '100%',
              px: 0.5,
              pb: 0.5,
              mb: 0.5,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}>
              <Box sx={{ width: 150, flex: '0 0 auto' }}>
                <Skeleton key={index} variant="text" width={Math.random() * 150} height={20} />
              </Box>
              <Skeleton key={index} variant="text" width={100} height={20} />
            </Box>))}
          </Box>
        )}

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}


        {!!exif && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 1,
              fontSize: 13,
            }}
          >
            {Object.entries(exif)
              .filter(([key]) => !ignoredKeys.includes(key))
              .map(([key, value]) => (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gridColumn: '1 / -1',
                    gap: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    px: 0.5,
                    pb: 0.5,
                    mb: 0.5,
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="caption" color="textSecondary" sx={{ width: 150, flex: '0 0 auto', fontFamily: 'monospace' }}
                  >
                    {splitByCamelCaseAll(key)}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {typeof value === 'object'
                      ? JSON.stringify(value)
                      : String(value)}
                  </Typography>
                </Box>
              ))}
          </Box>
        )}
      </Box>
    </>
  )
}
