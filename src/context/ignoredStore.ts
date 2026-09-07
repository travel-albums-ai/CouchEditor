import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import { useMemo } from 'react';

type IgnoredStore = {
  photos: string[];
};

const defaults: IgnoredStore = {
  photos: [],
};

const {
  Provider: IgnoredProvider,
  useSetStore,
  useStoreSelector: useIgnoredStoreSelector,
} = createLocalStorageStoreNg<IgnoredStore>(defaults, 'ignoredStore');

const photoSetCache = new WeakMap<string[], Set<string>>();
const getPhotoSet = (photos: string[]) => {
  let set = photoSetCache.get(photos);
  if (!set) {
    set = new Set(photos);
    photoSetCache.set(photos, set);
  }
  return set;
};

export const useIgnored = () => {
  const setSetting = useSetStore();

  return useMemo(() => ({
    setPhotos: (photos: string[]) => setSetting((prev) => ({ ...prev, photos })),
    add: (path: string) => {
      setSetting((prev) =>
        getPhotoSet(prev.photos).has(path) ? prev : { ...prev, photos: [...prev.photos, path] }
      );
    },
    remove: (path: string) =>
      setSetting((prev) => ({ ...prev, photos: prev.photos.filter((p) => p !== path) })),
    addMany: (paths: string[]) => {
      setSetting((prev) => {
        const current = getPhotoSet(prev.photos);
        const newPhotos = paths.filter((p) => !current.has(p));
        return newPhotos.length ? { ...prev, photos: [...prev.photos, ...newPhotos] } : prev;
      });
    },
    removeMany: (paths: string[]) => {
      const removing = new Set(paths);
      setSetting((prev) => ({ ...prev, photos: prev.photos.filter((p) => !removing.has(p)) }));
    },
  }), [setSetting]);
};

export const useIgnored_isIgnored = (path: string) => {
  return useIgnoredStoreSelector((state) => getPhotoSet(state.photos).has(path));
};

export const useIgnored_areAllIgnored = (paths: string[]) => {
  return useIgnoredStoreSelector((state) => paths.every((p) => getPhotoSet(state.photos).has(p)));
};

export { IgnoredProvider, useIgnoredStoreSelector };
