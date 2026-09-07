/* eslint-disable react-refresh/only-export-components */
import type { GalleryPhoto } from '@/lib/galleryData';
import { createContext, useContext, type ReactNode } from 'react';

const FilteredPhotosContext = createContext<GalleryPhoto[]>([]);

export function FilteredPhotosProvider({ children }: { children: ReactNode }) {
  const photos = [] as GalleryPhoto[];

  return (
    <FilteredPhotosContext.Provider value={photos}>
      {children}
    </FilteredPhotosContext.Provider>
  );
}

export const useFilteredPhotos_GLOBAL = () => useContext(FilteredPhotosContext);
