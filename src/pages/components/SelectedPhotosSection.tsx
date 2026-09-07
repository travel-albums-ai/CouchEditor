import GenericPanel from '@/components/generics/GenericPanel';
import NoPhotos from '@/components/NoPhotos';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import AllPhotosGridVirtuoso from '@/pages/components/AllPhotosGridVirtuoso';

type SelectedPhotosSectionProps = {
  typeName: string;
  id: string;
  selectMode: boolean;
  loading: boolean;
  selectedPhotosCount: number;
};

export default function SelectedPhotosSection({
  typeName,
  id,
  selectMode,
  loading,
  selectedPhotosCount,
}: SelectedPhotosSectionProps) {
  const sections = useSections_GLOBAL();

  const foundSection = sections?.find((s) => s.type === typeName);
  const foundSet = foundSection?.data?.find((d: any) => d.name === id);
  const photos = foundSet?.photos ?? [];

  return (
    <GenericPanel
      id="selected-photos-drawer"
      defaultTool
      toolContext={{
        showAll: false,
        selectedPhotos: selectedPhotosCount > 0,
        photosIds: photos.map((p) => p.id),
        selectMode,
      }}
    >
      {photos.length === 0 ? (
        <NoPhotos isLoading={loading} isEmpty />
      ) : (
        <AllPhotosGridVirtuoso key={typeName} photos={photos} />
      )}
    </GenericPanel>
  );
}
