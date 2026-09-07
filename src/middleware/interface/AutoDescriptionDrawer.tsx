import AutoTileCanvas from '@/components/AutoTileCanvas';
import GenericPanel from '@/components/generics/GenericPanel';
import SolidChip from '@/components/SolidChip';
import { useDescriptionsStoreSelector } from '@/context/descriptionsStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import BYOKCosts from '@/middleware/windows/settings/byok/BYOKCosts';
import ImageAnalyzer from '@/robot/ImageAnalyzer';
import { Box, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';


export default function AutoDescriptionDrawer() {
  const { type_name = '', id = '' } = useParams()
  const sections = useSections_GLOBAL()
  const filteredPhotos = useFilteredPhotos_GLOBAL();
  const descriptionsStore = useDescriptionsStoreSelector(state => state.descriptions)

  const [renderedIndex, setRenderedIndex] = useState(0)
  const [batchSize, setBatchSize] = useState(20)

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = type_name === '' ? filteredPhotos : foundSet?.photos || []

  const selectedPhotos = photos
    .filter((photo: GalleryPhoto) => !descriptionsStore.some((desc) => desc.id === photo.id))
    .filter((_, index) => index >= renderedIndex * batchSize && index < (renderedIndex + 1) * batchSize)

  const uniquePlaces =  [...new Set(selectedPhotos?.map(p => p?.city).map(c => c?.name))]

  return (
    <GenericPanel id="auto-description-drawer" defaultTool tool={<>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
        <SolidChip count={batchSize} label="batch size" minWidth={80} />
        <IconButton onClick={() => setBatchSize(batchSize - 1)} disabled={batchSize <= 1}>
          <Minus size={16} />
        </IconButton>
        <IconButton onClick={() => setBatchSize(batchSize + 1)}>
          <Plus size={16} />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
        <Button variant="outlined" onClick={() => setRenderedIndex(renderedIndex - 1)} disabled={renderedIndex <= 0}>
          <ChevronLeft size={16} />
        </Button>
        <Button variant="outlined" onClick={() => setRenderedIndex(renderedIndex + 1)} disabled={(renderedIndex + 1) * batchSize >= photos.length}>
          <ChevronRight size={16} />
        </Button>
      </Box>
    </>}>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'flex-start', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center', flexDirection: 'row', width: '100%', boxShadow: 2, borderRadius: 2 }}>
          <AutoTileCanvas
            photos={selectedPhotos}
            tileSize={175}
            columns={5}
            gap={10}
          />
        </Box>

        <Box sx={{ flex: 1 }} >
          <ImageAnalyzer photos={selectedPhotos} context={{ photoLocations: 'Photo where these photos were taken: ' + uniquePlaces.join(', ') }} />
        </Box>
      </Box>

      <BYOKCosts />

    </GenericPanel>
  )
}
