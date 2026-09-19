import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import type { SupportedLanguage } from '@/lib/i18n';
import { ImageArray } from '@/types/types';

type SettingsStore = {
  onboarding: boolean,
  onboardingStep: number,
  newVersion?: boolean,
  lightboxOpen: boolean,
  templatesOpen: boolean,
  lightboxImages: ImageArray,
  pipelineMaxConcurrentTasks: number,
  pipelinePhotoBatchSize: number,
  pipelineMaxAIRequests: number,
  pipelineAICallDelayMs: number,
  pipelineJpegQuality: number,
  pipelineImageConcurrency: number,
  pipelinePhaseCacheMB: number,
  pipelineAICacheMB: number,
  pipelineViewerMaxDimension: number,
  pipelineProgressPreviewMaxDimension: number,
  pipelineProgressPreviewQuality: number,
  pipelineSequentialMode: boolean,
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
  showHelp: boolean,
  helpIndependent: boolean,
  locale: SupportedLanguage,
}

const defaults: SettingsStore = {
  onboarding: true,
  onboardingStep: 0,
  newVersion: false,
  helpIndependent: false,
  performanceMode: false,
  templatesOpen: false,
  lightboxOpen: false,
  lightboxImages: [],
  thumbnailFormat: 'cover',
  themeMode: 'light',
  themeId: 'default',
  tutorial: false,
  loading: false,
  loadingValue: null,
  previewPhotoObj: undefined,
  pipelineMaxConcurrentTasks: 5,
  pipelinePhotoBatchSize: 10,
  pipelineMaxAIRequests: 2,
  pipelineAICallDelayMs: 250,
  pipelineJpegQuality: 92,
  pipelineImageConcurrency: 4,
  pipelinePhaseCacheMB: 384,
  pipelineAICacheMB: 128,
  pipelineViewerMaxDimension: 1600,
  pipelineProgressPreviewMaxDimension: 480,
  pipelineProgressPreviewQuality: 84,
  pipelineSequentialMode: false,
  showSettings: false,
  activeSettingsTab: undefined,
  showHelp: false,
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
