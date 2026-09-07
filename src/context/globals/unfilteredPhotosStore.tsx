/* eslint-disable react-refresh/only-export-components */
import { useFetch_TakeoutMetadata } from '@/hooks/remote/useFetch_TakeoutMetadata';
import type { GalleryPhoto } from '@/lib/galleryData';
import { createContext, useContext, type ReactNode } from 'react';

const UnfilteredPhotosContext = createContext<GalleryPhoto[]>([]);

export function UnfilteredPhotosProvider({ children }: { children: ReactNode }) {
  const { data: photos } = useFetch_TakeoutMetadata();

  return (
    <UnfilteredPhotosContext.Provider value={photos}>
      {children}
    </UnfilteredPhotosContext.Provider>
  );
}

export const useUnfilteredPhotos_GLOBAL = () => useContext(UnfilteredPhotosContext);
