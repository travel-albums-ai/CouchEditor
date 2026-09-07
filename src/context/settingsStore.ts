import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import { GalleryPhoto } from '@/lib/galleryData';
import type { SupportedLanguage } from '@/lib/i18n';

type SettingsStore = {
  onboarding: boolean,
  newVersion?: boolean,
  mascot: boolean,
  indexing: boolean,
  indexerProgress: any,
  indexerStartedAt: number | null,
  serverOnline: boolean,
  lightboxOpen: boolean,
  pipelineOpen: boolean,

  performanceMode: boolean,
  drawerId?: string,
  tutorial: boolean,
  themeMode?: 'light' | 'dark',
  themeId: string,
  thumbnailFormat: 'cover' | 'contain',
  showSidebar: boolean,
  thumbnailGenerator: boolean,
  thumbnailJobId?: string,
  drawerWidth?: number,
  scrollerOriginal: boolean,
  scrollerRows: number,
  scrollerColumns: number,
  scrollerGroupedByBatches: boolean,
  scrollerAutoScroll: boolean,
  mapShowPreview: boolean,
  activeSettingsTab?: string,
  previewPhotoObj?: GalleryPhoto
  focusedPhoto: string,
  loading: boolean,
  loadingValue: number | null,
  serverType: 'files' | 'http',
  sidebarTerm: string,
  sidebarSearchOpen: boolean,
  showPreviewMap: boolean,
  showMapAll: boolean,
  showSides: boolean,
  showPreviewExif: boolean,
  showPreviewComments: boolean,
  showOtherSidebar: boolean,
  showSettings: boolean,
  otherSidebar: 'photo' | 'summary' | 'exif' | 'similar',
  selectMode: boolean,
  albumType: 'segmented' | 'perDay' | 'flow' | 'default' | 'globe' | 'labeler' | 'scroller' | 'rows' | 'adjustments',
  locale: SupportedLanguage,
  isZygote: boolean,
  drawers: {
    dashboard: boolean,
    sidebar: boolean,
    globe: boolean,
    outlet: boolean,
    preview: boolean,
    adjustments: boolean,
    files: boolean,
    labeler: boolean,
    scroller: boolean,
    rows: boolean,
    calendar: boolean,
    folderHandler: boolean,
    autoDescription: boolean
  }
  modules: {
    peopleAndPets: boolean,
    nowAndThen: boolean,
    folders: boolean,
    trips: boolean,
    places: boolean,
    cities: boolean,
    views: boolean,
    timeline: boolean,
    likes: boolean,
    comments: boolean,
    favorites: boolean,
    ignored: boolean,
    private: boolean,
    selected: boolean,
    countries: boolean,
    tags: boolean,
    labels: boolean
  }
}

const defaults: SettingsStore = {
  onboarding: true,
  newVersion: false,
  performanceMode: false,
  indexing: false,
  indexerProgress: { totalFound: 0, totalFiles: 0, done: 0, preindexed: 0, failed: 0 },
  mascot: false,
  serverType: 'http',
  indexerStartedAt: null,
  lightboxOpen: false,
  sidebarTerm: '',
  serverOnline: true,
  otherSidebar: 'photo',
  thumbnailFormat: 'cover',
  scrollerOriginal: false,
  scrollerRows: 2,
  scrollerColumns: 3,
  scrollerGroupedByBatches: false,
  scrollerAutoScroll: true,
  drawerId: undefined,
  mapShowPreview: false,
  thumbnailGenerator: false,
  thumbnailJobId: undefined,
  showPreviewMap: false,
  showMapAll: false,
  showPreviewExif: false,
  showPreviewComments: false,
  themeMode: 'dark',
  themeId: 'default',
  showSides: true,
  showSidebar: true,
  showOtherSidebar: false,
  sidebarSearchOpen: false,
  tutorial: false,
  loading: false,
  loadingValue: null,
  previewPhotoObj: undefined,
  focusedPhoto: '',
  drawerWidth: 400,
  pipelineOpen: false,
  showSettings: false,
  activeSettingsTab: undefined,
  selectMode: false,
  albumType: 'default',
  locale: 'en',
  isZygote: false,
  drawers: {
    dashboard: true,
    scroller: true,
    globe: true,
    labeler: false,
    outlet: true,
    sidebar: true,
    files: true,
    preview: true,
    adjustments: true,
    rows: false,
    calendar: true,
    folderHandler: true,
    autoDescription: true
  },
  modules: {
    peopleAndPets: true,
    nowAndThen: true,
    folders: true,
    trips: true,
    cities: true,
    places: true,
    views: true,
    timeline: true,
    likes: true,
    comments: true,
    favorites: true,
    ignored: true,
    private: true,
    selected: true,
    countries: true,
    tags: true,
    labels: true,
  }
}

const {
  Provider: SettingsProvider,
  useSetStore,
  useStoreSelector: useSettingsStoreSelector,
  getStore: getSettingsStore,
  setStore: setSettingsStore,
} = createLocalStorageStoreNg<SettingsStore>(defaults, 'settingsStore')

export const useSettings = () => {
  const setSetting = useSetStore()

  return {
    setSetting,
    setModule: (module: keyof SettingsStore['modules'], value: boolean) => {
      setSetting(prev => ({
        ...prev,
        modules: {
          ...prev.modules,
          [module]: value,
        },
      }))
    },
    setDrawer: (drawer: keyof SettingsStore['drawers'], value: boolean) => {
      setSetting(prev => ({
        ...prev,
        drawers: {
          ...prev.drawers,
          [drawer]: value,
        },
      }))
    },
    setPreviewPhotoObj: (photo: GalleryPhoto | undefined) => {
      setSetting(prev => ({
        ...prev,
        previewPhotoObj: photo,
      }))
    },
    setFocusedPhoto: (photoId: string) => {
      setSetting(prev => ({
        ...prev,
        focusedPhoto: photoId,
      }))
    },
  }
}

export { getSettingsStore, setSettingsStore, SettingsProvider, useSettingsStoreSelector };
