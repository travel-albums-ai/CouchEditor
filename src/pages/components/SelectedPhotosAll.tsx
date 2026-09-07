import GenericPanel from '@/components/generics/GenericPanel';
import NoPhotos from '@/components/NoPhotos';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSelectedStoreSelector } from '@/context/selectedStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import AllPhotosGridVirtuoso from '@/pages/components/AllPhotosGridVirtuoso';

export default function SelectedPhotosAll() {
  const photos = useFilteredPhotos_GLOBAL();
  const selectMode = useSettingsStoreSelector((state) => state.selectMode);
  const loading = useSettingsStoreSelector((state) => state.loading);
  const selectedPhotos = useSelectedStoreSelector((state) => state.photos);

  return (
    <GenericPanel
      id="selected-photos-drawer"
      defaultTool
      toolContext={{
        showAll: true,
        selectedPhotos: selectedPhotos.length > 0,
        photosIds: photos.map((p) => p.id),
        selectMode,
      }}
    >
      {photos.length === 0 ? (
        <NoPhotos isLoading={loading} isEmpty />
      ) : (
        <AllPhotosGridVirtuoso photos={photos} />
      )}
    </GenericPanel>
  );
}
