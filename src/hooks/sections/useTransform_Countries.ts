import { useMemo } from 'react';

import { useSettingsStoreSelector } from '@/context/settingsStore';
import countriesWorker from '@/hooks/sections/workers/countries.worker';
import { GalleryPhoto } from '@/lib/galleryData';

export default function useTransform_Countries(photos: GalleryPhoto[]) {
  const enabled = useSettingsStoreSelector(s => s.modules.countries);

  const result = useMemo(() => {
    if (!enabled || !photos?.length) return [];

    return countriesWorker(photos);
  }, [photos, enabled]);

  return result;
}
