import AlbumsMetaDetails from '@/components/AlbumsMetaDetails';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import { Filter } from 'lucide-react';

export default function SystemStatus() {
  const rawPhotos = useUnfilteredPhotos_GLOBAL();
  const photos = rawPhotos || []
  const photosFiltered = useFilteredPhotos_GLOBAL();

  return (<>
    <AlbumsMetaDetails id="database-counts" photos={photos} minWidth={50} extraItems={[
      ...(photosFiltered.length !== photos.length) ? [{
        label: 'Filtered',
        value: photosFiltered.length,
        icon: <Filter size={14} color={photosFiltered.length === 0 ? 'red' : undefined} />
      }] : [],
    ]} />
  </>)
}
