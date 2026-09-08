import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import type { SupportedLanguage } from '@/lib/i18n';
import { ImageArray } from '@/middleware/windows/pipeline/types';

type SettingsStore = {
  onboarding: boolean,
  onboardingStep: number,
  newVersion?: boolean,
  serverOnline: boolean,
  lightboxOpen: boolean,
  lightboxImages: ImageArray,
  pipelineOpen: boolean,
  performanceMode: boolean,
  tutorial: boolean,
  themeMode?: 'light' | 'dark',
  themeId: string,
  thumbnailFormat: 'cover' | 'contain',
  activeSettingsTab?: string,
  previewPhotoObj?: string,
  loading: boolean,
  loadingValue: number | null,
  showSettings: boolean,
  selectMode: boolean,
  locale: SupportedLanguage,
}

const defaults: SettingsStore = {
  onboarding: true,
  onboardingStep: 0,
  newVersion: false,
  performanceMode: false,
  lightboxOpen: false,
  lightboxImages: [],
  serverOnline: true,
  thumbnailFormat: 'cover',
  themeMode: 'dark',
  themeId: 'default',
  tutorial: false,
  loading: false,
  loadingValue: null,
  previewPhotoObj: undefined,
  pipelineOpen: false,
  showSettings: false,
  activeSettingsTab: undefined,
  selectMode: false,
  locale: 'en',
} satisfies SettingsStore;

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
    setPreviewPhotoObj: (photo: string | undefined) => {
      setSetting(prev => ({
        ...prev,
        previewPhotoObj: photo,
      }))
    },
  }
}

export { getSettingsStore, setSettingsStore, SettingsProvider, useSettingsStoreSelector };
