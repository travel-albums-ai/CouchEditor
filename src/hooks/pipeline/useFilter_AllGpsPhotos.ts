import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';

export const useFilter_AllGpsPhotos = () => {
  const rawPhotos = useFilteredPhotos_GLOBAL();

  return rawPhotos.filter(photo => photo.latitude !== null && photo.longitude !== null);
};
