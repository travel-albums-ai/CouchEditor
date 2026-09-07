import { useSelectedStoreSelector } from '@/context/selectedStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import SelectedPhotosAll from '@/pages/components/SelectedPhotosAll';
import SelectedPhotosSection from '@/pages/components/SelectedPhotosSection';
import { useParams } from 'react-router-dom';

export default function SelectedPhotosPage_type_name() {
  const { type_name = '', id = '' } = useParams();

  const selectMode = useSettingsStoreSelector((state) => state.selectMode);
  const loading = useSettingsStoreSelector((state) => state.loading);
  const selectedPhotos = useSelectedStoreSelector((state) => state.photos);

  const showAll = type_name === '';

  if (showAll) {
    return <SelectedPhotosAll />;
  }

  return (
    <SelectedPhotosSection
      typeName={type_name}
      id={id}
      selectMode={selectMode}
      loading={loading}
      selectedPhotosCount={selectedPhotos.length}
    />
  );
}
