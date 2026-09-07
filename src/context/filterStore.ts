import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type SectionFilter = {
  included: string[],
  includedPhotos: Set<string>,
  excluded: string[],
  excludedPhotos: Set<string>,
}

type SectionFilterPreset = {
  included: string[],
  includedPhotos: string[],
  excluded: string[],
  excludedPhotos: string[],
}

export type FilterStore = {
  showWithWithoutPersons: boolean | null
  showWithWithoutGps: boolean | null
  showViews: boolean
  showViewsMin: number
  showLikes: boolean
  showLikesMin: number,
  showComments: boolean
  showCommentsMin: number,
  sortOrder: 'newestFirst' | 'oldestFirst',
  filterDates: boolean,
  filterCountries: boolean,
  filterFolders: boolean,
  filterPeopleAndPets: boolean,
  gps: {
    north: number,
    south: number,
    east: number,
    west: number
  }

  filterGps: boolean,

  dates: {
    startDate: number,
    endDate: number,
    title: string,
    active: boolean
  }[]
  sections: {
    peopleAndPets: SectionFilter,
    folders: SectionFilter,
    countries: SectionFilter
  }
}

type FilterStorePreset = Omit<FilterStore, 'sections'> & {
  sections: {
    peopleAndPets: SectionFilterPreset,
    folders: SectionFilterPreset,
    countries: SectionFilterPreset,
  }
}

const defaults: FilterStore = {
  showWithWithoutPersons: null,
  showWithWithoutGps: null,
  showViews: false,
  showViewsMin: 0,
  showLikes: false,
  showLikesMin: 0,
  showComments: false,
  showCommentsMin: 0,
  sortOrder: 'newestFirst',
  filterGps: false,
  gps: {
    north: 90,
    south: -90,
    east: 180,
    west: -180
  },
  filterDates: false,
  filterCountries: false,
  filterFolders: false,
  filterPeopleAndPets: false,

  dates: [
    {
      startDate: 1778536800000,
      endDate: 1778536800000,
      title: 'Sample range',
      active: false
    }
  ],

  sections: {
    peopleAndPets: {
      included: [],
      includedPhotos: new Set<string>(),
      excluded: [],
      excludedPhotos: new Set<string>(),
    },
    folders: {
      included: [],
      includedPhotos: new Set<string>(),
      excluded: [],
      excludedPhotos: new Set<string>(),
    },
    countries: {
      included: [],
      includedPhotos: new Set<string>(),
      excluded: [],
      excludedPhotos: new Set<string>(),
    }
  }
}

const {
  Provider: FilterProvider,
  useStore,
  useSetStore,
  useStoreSelector: useFilterStoreSelector
} = createLocalStorageStoreNg<FilterStore>(defaults, 'filterStore')

export const useFilterPhotos = () => {
  const filterStore = useStore()
  const setSetting = useSetStore()
  // const rawSetSetting = useSetStore()
  // const isZygote = useSettingsStoreSelector((state) => state.isZygote)

  // const setSetting = useCrossTabStoreSync<FilterStore>({
  //   channelName: 'trip-gallery:filterStore:sync',
  //   eventName: 'trip-gallery:filterStore:update',
  //   isReceiver: isZygote,
  //   setLocalState: rawSetSetting,
  //   applyIncoming: (next) => {
  //     rawSetSetting(() => next)
  //   },
  // })

  const addToIncludedForSection = (section: keyof FilterStore['sections'], value: string, photos: string[]) => {
    setSetting((prev) => {
      const currentIncluded = prev.sections[section].included;
      if (currentIncluded.includes(value)) return prev;

      return {
        ...prev,
        sections: {
          ...prev.sections,
          [section]: {
            ...prev.sections[section],
            included: [...currentIncluded, value],
            includedPhotos: new Set([...prev.sections[section].includedPhotos, ...photos]),
          }
        }
      }
    })
  }

  const removeFromIncludedForSection = (section: keyof FilterStore['sections'], value: string, photos: string[]) => {
    setSetting((prev) => {
      const currentIncluded = prev.sections[section].included;
      if (!currentIncluded.includes(value)) return prev;

      return {
        ...prev,
        sections: {
          ...prev.sections,
          [section]: {
            ...prev.sections[section],
            included: currentIncluded.filter(v => v !== value),
            includedPhotos: new Set([...prev.sections[section].includedPhotos].filter(p => !photos.includes(p))),
          }
        }
      }
    })
  }

  const addToExcludedForSection = (section: keyof FilterStore['sections'], value: string, photos: string[]) => {
    setSetting((prev) => {
      const currentExcluded = prev.sections[section].excluded;
      if (currentExcluded.includes(value)) return prev;

      return {
        ...prev,
        sections: {
          ...prev.sections,
          [section]: {
            ...prev.sections[section],
            excluded: [...currentExcluded, value],
            excludedPhotos: new Set([...prev.sections[section].excludedPhotos, ...photos]),
          }
        }
      }
    })
  }

  const removeFromExcludedForSection = (section: keyof FilterStore['sections'], value: string, photos: string[]) => {
    setSetting((prev) => {
      const currentExcluded = prev.sections[section].excluded;
      if (!currentExcluded.includes(value)) return prev;

      return {
        ...prev,
        sections: {
          ...prev.sections,
          [section]: {
            ...prev.sections[section],
            excluded: currentExcluded.filter(v => v !== value),
            excludedPhotos: new Set([...prev.sections[section].excludedPhotos].filter(p => !photos.includes(p))),
          }
        }
      }
    })
  }

  const isIncluded = (section: keyof FilterStore['sections'], value: string) => {
    return filterStore.sections[section].included.includes(value);
  }

  const isExcluded = (section: keyof FilterStore['sections'], value: string) => {
    return filterStore.sections[section].excluded.includes(value);
  }

  return {
    setSetting,
    addToIncludedForSection,
    removeFromIncludedForSection,
    isIncluded,
    addToExcludedForSection,
    removeFromExcludedForSection,
    isExcluded,
    toggleIncludedSection: (section: keyof FilterStore['sections'], value: string, photos: string[]) => {
      if (isIncluded(section, value)) {
        removeFromIncludedForSection(section, value, photos)
      } else {
        addToIncludedForSection(section, value, photos)
      }
    },
    toggleExcludedSection: (section: keyof FilterStore['sections'], value: string, photos: string[]) => {
      if (isExcluded(section, value)) {
        removeFromExcludedForSection(section, value, photos)
      } else {
        addToExcludedForSection(section, value, photos)
      }
    },
    getIncludedForSection: (section: keyof FilterStore['sections']) => {
      return filterStore.sections[section].included;
    },
    getExcludedForSection: (section: keyof FilterStore['sections']) => {
      return filterStore.sections[section].excluded;
    },
    clearSection: (section: keyof FilterStore['sections']) => {
      setSetting((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [section]: {
            included: [],
            includedPhotos: new Set<string>(),
            excluded: [],
            excludedPhotos: new Set<string>(),
          }
        }
      }))
    },
    toggleDates: (index: number) => {
      setSetting((prev) => {
        const newDates = [...prev.dates]
        newDates[index] = {
          ...newDates[index],
          active: !newDates[index].active
        }
        return {
          ...prev,
          dates: newDates
        }
      })
    },
    addDates: (startDate: number, endDate: number, title: string) => {
      setSetting((prev) => ({
        ...prev,
        dates: [...prev.dates, { startDate, endDate, title, active: true }]
      }))
    },
    deleteDates:  (index: number) => {
      setSetting((prev) => ({
        ...prev,
        dates: prev.dates.filter((_, i) => i !== index)
      }))
    },
    loadFromPreset: (data: FilterStorePreset) => {
      setSetting(() => ({
        ...data,
        sections: {
          peopleAndPets: {
            included: data.sections.peopleAndPets.included,
            includedPhotos: new Set<string>(data.sections.peopleAndPets.includedPhotos),
            excluded: data.sections.peopleAndPets.excluded,
            excludedPhotos: new Set<string>(data.sections.peopleAndPets.excludedPhotos),
          },
          folders: {
            included: data.sections.folders.included,
            includedPhotos: new Set<string>(data.sections.folders.includedPhotos),
            excluded: data.sections.folders.excluded,
            excludedPhotos: new Set<string>(data.sections.folders.excludedPhotos),
          },
          countries: {
            included: data.sections.countries.included,
            includedPhotos: new Set<string>(data.sections.countries.includedPhotos),
            excluded: data.sections.countries.excluded,
            excludedPhotos: new Set<string>(data.sections.countries.excludedPhotos),
          }
        }
      }))
    },
    reset: () => {
      setSetting(defaults)
    },
  }
}

export { FilterProvider, useFilterStoreSelector };
