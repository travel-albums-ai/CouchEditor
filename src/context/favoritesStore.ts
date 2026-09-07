import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type FavoritesStore = {
  photos: string[]
}

const defaults: FavoritesStore = {
  photos: [],
}

const {
  Provider: FavoritesProvider,
  useStore,
  useSetStore,
  useStoreSelector: useFavoritesStoreSelector
} = createLocalStorageStoreNg<FavoritesStore>(defaults, 'favoritesStore')

export const useFavorites = () => {
  const store = useStore()
  const setState = useSetStore()

  return {
    add: (path: string) => {
      if (!store.photos.includes(path)) setState((prev) => ({ ...prev, photos: [...prev.photos, path] }))
    },
    remove: (path: string) => setState((prev) => ({ ...prev, photos: prev.photos.filter(p => p !== path) })),
    isFavorite: (path: string) => store.photos.includes(path),
    areAllFavorite: (paths: string[]) => paths.every(p => store.photos.includes(p)),
    addMany: (paths: string[]) => {
      const newPhotos = paths.filter(p => !store.photos.includes(p))
      if (newPhotos.length) setState((prev) => ({ ...prev, photos: [...prev.photos, ...newPhotos] }))
    },
    removeMany: (paths: string[]) => setState((prev) => ({ ...prev, photos: prev.photos.filter(p => !paths.includes(p)) }))
  }
}

export { FavoritesProvider, useFavoritesStoreSelector };
