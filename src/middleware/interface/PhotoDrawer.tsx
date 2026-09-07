import AlbumsMetaDetails from '@/components/AlbumsMetaDetails';
import GenericPanel from '@/components/generics/GenericPanel';
import Histogram from '@/components/Histogram';
import PhotoExifComplete from '@/components/PhotoExifComplete';
import PhotoExifDetails from '@/components/PhotoExifDetails';
import PopoverButton from '@/components/PopoverButton';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { composeUrl } from '@/lib/thumbnailService';
import ElementLabels from '@/middleware/interface/components/ElementLabels';
import ZoomPhoto from '@/middleware/interface/components/ZoomPhoto';
import DescribePhoto from '@/middleware/interface/preview/DescribePhoto';
import AlbumMapPanel from '@/pages/components/AlbumMapPanel';
import { Box, Chip, Typography } from '@mui/material';
import { FileQuestionMark, MessageSquare } from 'lucide-react';

export default function PhotoDrawer() {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)
  const showPreviewMap = useSettingsStoreSelector((state) => state.showPreviewMap)
  const showPreviewExif = useSettingsStoreSelector((state) => state.showPreviewExif)
  const showPreviewComments = useSettingsStoreSelector((state) => state.showPreviewComments)

  const photo = previewPhotoObj ?? null

  if (!photo) {
    return (<>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, height: '100%' }}>
        <Typography color="textDisabled" variant="subtitle2">Select a photo to continue</Typography>
        <FileQuestionMark size={20}  />
      </Box>
    </>
    )
  }

  const coordinatesAvailable =
    typeof photo.latitude === 'number' && typeof photo.longitude === 'number' && !isNaN(photo.latitude) && !isNaN(photo.longitude)

  return (
    <>
      <GenericPanel id="photo-drawer" defaultTool toolContext={{ photoId: photo.id }}>

        {showPreviewExif && <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <PopoverButton trigger={<PhotoExifDetails photo={photo} />} width={500}
            anchorHorizontal="center"
            anchorVertical="top"
            transformHorizontal="center"
            transformVertical="bottom"
          >
            <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
              <PhotoExifComplete photo={photo} />
            </Box>
          </PopoverButton>
          <Histogram imageUrl={composeUrl(photo)} width={100} height={50} />
        </Box>}


        <Box sx={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden', borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 2 }}>
          <ZoomPhoto />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', p: 1, alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <AlbumsMetaDetails photos={[photo]} minWidth={25} />
          <Typography variant="caption" color="textSecondary">{photo.takenAt && new Date(photo.takenAt).toLocaleString()}</Typography>
        </Box>


        {showPreviewMap && coordinatesAvailable && photo.latitude !== 0 && <Box sx={{ position: 'relative', boxShadow: 2 }}>
          <AlbumMapPanel photos={[photo]} />
          <a
            href={`https://maps.google.com/?q=${photo.latitude},${photo.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            <Chip label="🗺️ Google Maps" size="small" color="primary" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 401 }} />
          </a>
        </Box>}

        <DescribePhoto photoId={photo.id} />

        {showPreviewComments && photo.social.length > 0 && <Box sx={{
          display: 'flex', flexDirection: 'column',
          flex: '0  1 auto', width: '100%',
          gap: 1, p: 1,
          overflow: 'hidden', borderRadius: 2,
          border: '1px solid', borderColor: 'divider',
          boxShadow: 2
        }}>
          {photo.social.map((social, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }} title={social.creationTime.formatted}>
              <MessageSquare size={16} />
              <Typography variant="caption" color="textDisabled" sx={{ whiteSpace: 'nowrap' }}># {social.contentOwnerName}</Typography>
              <Typography variant="caption" color="textSecondary">{social.text}</Typography>
            </Box>
          ))}
        </Box>}

        <ElementLabels photoId={photo.id} />

      </GenericPanel>
    </>)
}
