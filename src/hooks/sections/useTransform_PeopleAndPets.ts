import { useSettingsStoreSelector } from '@/context/settingsStore';
import peopleAndPetsWorker from '@/hooks/sections/workers/peopleGrouping.worker';
import { GalleryPhoto } from '@/lib/galleryData';
import { useMemo } from 'react';

export default function useTransform_PeopleAndPets(photos: GalleryPhoto[]) {
  const enabled = useSettingsStoreSelector(s => s.modules.peopleAndPets);

  return useMemo(() => {
    if (!enabled || !photos?.length) return [];

    return peopleAndPetsWorker(photos);
  }, [photos, enabled]);
}
