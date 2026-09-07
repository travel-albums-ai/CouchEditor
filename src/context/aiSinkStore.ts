import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import { useEffect } from 'react';

type aiSinkStore = {
  autoDescriptionPreview?: string
}

const defaults: aiSinkStore = {
  autoDescriptionPreview: '',
}

const {
  Provider: AISinkProvider,
  useStore,
  useSetStore,
  useStoreSelector: useAISinkStoreSelector
} = createLocalStorageStoreNg<aiSinkStore>(defaults, 'aiSinkStore')

export const useAISink = () => {
  const store = useStore()
  const setSetting = useSetStore()

  useEffect(() => {
    console.log('aiSinkStore: autoDescriptionPreview changed:', store)
  }, [store])

  return {
    setSetting,
  }
}

export { AISinkProvider, useAISinkStoreSelector };
