import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type FilterProps = {
  id: string,
  name: string,
  data: any
}

type PresetSettings = {
  filters: FilterProps[],
  filterIndex: number,
}

const defaults: PresetSettings = {
  filters: [

  ],
  filterIndex: 0
}

const {
  Provider: FilterPresetProvider,
  useSetStore,
  useStoreSelector: useFilterPresetSelector
} = createLocalStorageStoreNg<PresetSettings>(defaults, 'filterPresetStore')

export const useFilterPresetStore = () => {
  const setSetting = useSetStore()

  return {
    addFilter: (name: string, data: any) => {
      setSetting((prev) => ({
        ...prev,
        filters: [...prev.filters, { id: `filter-${Date.now()}`, name, data }]
      }))
    },
    deleteFilter: (id: string) => {
      setSetting((prev) => ({
        ...prev,
        filters: prev.filters.filter((filter) => filter.id !== id)
      }))
    },
    reset: () => {
      setSetting(defaults)
    },
    updateName: (id: string, name: string) => {
      setSetting((prev) => {
        const newFilters = [...prev.filters]
        const index = newFilters.findIndex(f => f.id === id)
        if (index !== -1) {
          newFilters[index] = { ...newFilters[index], name }
        }
        return {
          ...prev,
          filters: newFilters
        }
      })
    }
  }
}

export { FilterPresetProvider, useFilterPresetSelector };
