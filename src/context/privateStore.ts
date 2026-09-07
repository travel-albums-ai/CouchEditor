import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import { useMemo } from 'react';

type PrivateStore = {
  photos: string[];
};

const defaults: PrivateStore = {
  photos: [],
};

const {
  Provider: PrivateProvider,
  useStore,
  useSetStore,
  useStoreSelector: usePrivateStoreSelector,
} = createLocalStorageStoreNg<PrivateStore>(defaults, 'private');

export const usePrivate = () => {
  const settings = useStore();
  const setSetting = useSetStore();

  const photoSet = useMemo(() => new Set(settings.photos), [settings.photos]);

  return useMemo(() => ({
    add: (path: string) => {
      if (!photoSet.has(path))
        setSetting((prev) => ({ ...prev, photos: [...prev.photos, path] }));
    },
    remove: (path: string) =>
      setSetting((prev) => ({ ...prev, photos: prev.photos.filter((p) => p !== path) })),
    isPrivate: (path: string) => photoSet.has(path),
    areAllPrivate: (paths: string[]) => paths.every((p) => photoSet.has(p)),
    addMany: (paths: string[]) => {
      const incoming = paths.filter((p) => !photoSet.has(p));
      if (incoming.length)
        setSetting((prev) => ({ ...prev, photos: [...prev.photos, ...incoming] }));
    },
    removeMany: (paths: string[]) => {
      const removing = new Set(paths);
      setSetting((prev) => ({ ...prev, photos: prev.photos.filter((p) => !removing.has(p)) }));
    },
  }), [photoSet, setSetting]);
};

export { PrivateProvider, usePrivateStoreSelector };
