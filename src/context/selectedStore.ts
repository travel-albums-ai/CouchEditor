import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import { useMemo } from 'react';

type SelectedStore = {
  photos: string[];
};

const defaults: SelectedStore = {
  photos: [],
};

const {
  Provider: SelectedProvider,
  useSetStore,
  useStoreSelector: useSelectedStoreSelector,
} = createLocalStorageStoreNg<SelectedStore>(defaults, 'selectedStore');

const photoSetCache = new WeakMap<string[], Set<string>>();
const getPhotoSet = (photos: string[]) => {
  let set = photoSetCache.get(photos);
  if (!set) {
    set = new Set(photos);
    photoSetCache.set(photos, set);
  }
  return set;
};

export const useSelected = () => {
  const setState = useSetStore();

  return useMemo(() => ({
    add: (path: string) => {
      setState((prev) =>
        prev.photos.includes(path) ? prev : { ...prev, photos: [...prev.photos, path] }
      );
    },
    remove: (path: string) =>
      setState((prev) => ({ ...prev, photos: prev.photos.filter((p) => p !== path) })),
    addMany: (paths: string[]) => {
      setState((prev) => {
        const current = getPhotoSet(prev.photos);
        const incoming = paths.filter((p) => !current.has(p));
        return incoming.length ? { ...prev, photos: [...prev.photos, ...incoming] } : prev;
      });
    },
    removeMany: (paths: string[]) => {
      const removing = new Set(paths);
      setState((prev) => ({ ...prev, photos: prev.photos.filter((p) => !removing.has(p)) }));
    },
    invertMany: (paths: string[]) =>
      setState((prev) => {
        const current = new Set(prev.photos);
        for (const p of paths) {
          if (current.has(p)) current.delete(p);
          else current.add(p);
        }
        return { ...prev, photos: [...current] };
      }),
  }), [setState]);
};

export const useSelected_isSelected = (path: string) => {
  return useSelectedStoreSelector((state) => getPhotoSet(state.photos).has(path));
};

export { SelectedProvider, useSelectedStoreSelector };
