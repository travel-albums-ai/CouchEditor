import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type DescriptionStore = {
  descriptions: {
    id: string
    description: string
  }[]
}

const defaults: DescriptionStore = {
  descriptions: []
}

const {
  Provider: DescriptionsProvider,
  useStore,
  useSetStore,
  useStoreSelector: useDescriptionsStoreSelector
} = createLocalStorageStoreNg<DescriptionStore>(defaults, 'descriptionsStore')

export const useDescriptions = () => {
  const store = useStore()
  const setState = useSetStore()

  return {
    describePhoto: (id: string, description: string) => {
      const nextDescription = description.trim()

      setState((prev) => {
        const existing = prev.descriptions.find(item => item.id === id)

        if (!nextDescription) {
          return existing
            ? { ...prev, descriptions: prev.descriptions.filter(item => item.id !== id) }
            : prev
        }

        if (existing?.description === nextDescription) {
          return prev
        }

        return {
          ...prev,
          descriptions: existing
            ? prev.descriptions.map(item => item.id === id ? { ...item, description: nextDescription } : item)
            : [...prev.descriptions, { id, description: nextDescription }]
        }
      })
    },
    getDescription: (id: string) => store.descriptions.find(item => item.id === id)?.description ?? '',
    hasDescription: (id: string) => store.descriptions.some(item => item.id === id),
    removeDescription: (id: string) => {
      setState((prev) => {
        const descriptions = prev.descriptions.filter(item => item.id !== id)
        return descriptions.length === prev.descriptions.length ? prev : { ...prev, descriptions }
      })
    },
    removeDescriptions: (ids: string[]) => {
      const idsToRemove = new Set(ids)
      setState((prev) => {
        const descriptions = prev.descriptions.filter(item => !idsToRemove.has(item.id))
        return descriptions.length === prev.descriptions.length ? prev : { ...prev, descriptions }
      })
    }
  }
}

export { DescriptionsProvider, useDescriptionsStoreSelector };
