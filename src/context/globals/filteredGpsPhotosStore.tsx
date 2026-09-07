/* eslint-disable react-refresh/only-export-components */
import { useFilter_AllGpsPhotos } from '@/hooks/pipeline/useFilter_AllGpsPhotos';
import type { GalleryPhoto } from '@/lib/galleryData';
import { createContext, useContext, type ReactNode } from 'react';

const FilteredGpsPhotosContext = createContext<GalleryPhoto[]>([]);

export function FilteredGpsPhotosProvider({ children }: { children: ReactNode }) {
  const photos = useFilter_AllGpsPhotos();

  return (
    <FilteredGpsPhotosContext.Provider value={photos}>
      {children}
    </FilteredGpsPhotosContext.Provider>
  );
}

export const useFilteredGpsPhotos_GLOBAL = () => useContext(FilteredGpsPhotosContext);
