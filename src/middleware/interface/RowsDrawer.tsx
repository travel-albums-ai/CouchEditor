import GenericPanel from '@/components/generics/GenericPanel';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSelectedStoreSelector } from '@/context/selectedStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import AllPhotosRowsVirtuoso from '@/middleware/interface/rows/AllPhotosRowsVirtuoso';
import { useParams } from 'react-router-dom';

export default function RowsDrawer() {
  const { type_name = '', id = '' } = useParams()
  const selectMode = useSettingsStoreSelector((state) => state.selectMode)
  const selectedPhotos = useSelectedStoreSelector((state) => state.photos)
  const sections = useSections_GLOBAL()
  const photosFiltered = useFilteredPhotos_GLOBAL()

  const showAll = type_name === ''

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = showAll ? photosFiltered : foundSet?.photos || []

  return (
    <GenericPanel id="rows-drawer" defaultTool toolContext={{ showAll, selectedPhotos: selectedPhotos.length > 0, photosIds: photos.map((p: GalleryPhoto) => p.id), selectMode }}>
      <AllPhotosRowsVirtuoso photos={photos} />
    </GenericPanel>
  );
}
