import { useFilterStoreSelector } from '@/context/filterStore';
import albumsWorker from '@/hooks/sections/workers/albums.worker';
import { GalleryPhoto } from '@/lib/galleryData';
import { useMemo } from 'react';

export const useTransform_Albums = (photos: GalleryPhoto[]): any[] | null => {
  const sortOrder = useFilterStoreSelector((state) => state.sortOrder);

  return useMemo(() => {
    if (!photos?.length) return null;

    return albumsWorker(photos, sortOrder);
  }, [photos, sortOrder]);
};
