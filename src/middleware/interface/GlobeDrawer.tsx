import GenericPanel from '@/components/generics/GenericPanel';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import AlbumGlobe from '@/middleware/interface/globe/AlbumGlobe';
import { useParams } from 'react-router-dom';

export default function GlobeDrawer() {
  const { type_name = '', id = '' } = useParams()
  const sections = useSections_GLOBAL()
  const filteredPhotos = useFilteredPhotos_GLOBAL();
  const unfilteredPhotos = useUnfilteredPhotos_GLOBAL();
  const showMapAll = useSettingsStoreSelector((state) => state.showMapAll)

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = showMapAll ? unfilteredPhotos : type_name === '' ? filteredPhotos : foundSet?.photos || []

  return (
    <GenericPanel id="globe-drawer" defaultTool>
      <AlbumGlobe photos={showMapAll ? unfilteredPhotos : photos} multiplier={1.1} />
    </GenericPanel>
  );
}
