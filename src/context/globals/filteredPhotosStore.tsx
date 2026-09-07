/* eslint-disable react-refresh/only-export-components */
import { useFilter_AllPhotos } from '@/hooks/pipeline/useFilter_AllPhotos';
import type { GalleryPhoto } from '@/lib/galleryData';
import { createContext, useContext, type ReactNode } from 'react';

const FilteredPhotosContext = createContext<GalleryPhoto[]>([]);

export function FilteredPhotosProvider({ children }: { children: ReactNode }) {
  const photos = useFilter_AllPhotos();

  return (
    <FilteredPhotosContext.Provider value={photos}>
      {children}
    </FilteredPhotosContext.Provider>
  );
}

export const useFilteredPhotos_GLOBAL = () => useContext(FilteredPhotosContext);
