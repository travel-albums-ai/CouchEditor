import useTransform_Photo2Exif from '@/hooks/useTransform_Photo2Exif';
import { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';
import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { Aperture, Camera, Focus, Rabbit, SquareFunction, Timer } from 'lucide-react';
import { cloneElement } from 'react';

export default function PhotoExifDetails({ photo }: { photo?: GalleryPhoto }) {
  const { exif } = useTransform_Photo2Exif(composeUrl(photo, true))

  const items = [
    {
      key: 'FNumber',
      value: exif?.FNumber ? `ƒ/${exif.FNumber}` : null,
      icon: <SquareFunction size={20} />
    },
    {
      key: 'ExposureTime',
      value: exif?.ExposureTime ? `${Math.round(exif.ExposureTime * 1000 * 1000) / 1000 }ms` : null,
      icon: <Timer size={20} />
    },
    {
      key: 'ISOSpeedRatings',
      value: exif?.ISO ? `ISO ${exif.ISO}` : null,
      icon: <Rabbit size={20} />
    },
    {
      key: 'FocalLength',
      value: exif?.FocalLength ? `${exif.FocalLength}mm` : null,
      icon: <Focus size={20} />
    },
    {
      key: 'Model',
      value: exif?.Model || null,
      icon: <Camera size={20} />
    },
    {
      key: 'ApertureValue',
      value: exif?.ApertureValue ? `Av ${exif.ApertureValue}` : null,
      icon: <Aperture size={20} />
    }
  ]

  return (<>
    {/* <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={1}
    > */}
    <Box sx={{
      display: 'grid',
      gap: 1,
      gridTemplateColumns: 'repeat(3, 1fr)',
    }}>
      {items
        .map(item => (
          <Tooltip title={item.key + ": " + (item.value ?? '')} arrow key={item.key}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center', width: '80px',
              border: '1px dotted', borderColor: 'divider',
              borderRadius: 2, p: 0.25, py: 0.5,
              '&:hover': { bgcolor: 'action.hover' } }}>
              <Box sx={{ color: 'text.secondary' }}>
                {item.icon && cloneElement(item.icon as React.ReactElement<{ size: number }>, { size: 16 })}
              </Box>
              {item.value && <Typography variant="caption" sx={{ width: '65px', fontSize: '11px' }} align="center" noWrap color="textSecondary" >{item.value || '0'}</Typography>}
              {!item.value && <Skeleton variant="text" width={40} height={20} />}
            </Box>
          </Tooltip>
        ))}
    </Box>
    {/* </Stack> */}
  </>)
}
