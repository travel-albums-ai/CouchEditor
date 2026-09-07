import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type AlbumPhotoCardStore = {
  width: number
  height: number
  showDescription: boolean
  showTags: boolean
  showDate: boolean
  showLocation: boolean
  showFileName?: boolean
}

const defaults: AlbumPhotoCardStore = {
  width: 300,
  height: 300,
  showDescription: true,
  showTags: true,
  showDate: true,
  showLocation: true,
  showFileName: false,
}

const {
  Provider: AlbumPhotoCardProvider,
  useSetStore,
  useStoreSelector: useAlbumPhotoCardStoreSelector
} = createLocalStorageStoreNg<AlbumPhotoCardStore>(defaults, 'AlbumPhotoCardStore')

export const useAlbumPhotoCard = () => {
  const setSetting = useSetStore()

  return { setSetting }
}

export { AlbumPhotoCardProvider, useAlbumPhotoCardStoreSelector };
