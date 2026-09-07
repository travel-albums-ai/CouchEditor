import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type AdjustmentsStore = {
  showGenetic: boolean;
  originalBase64: string | null;
  processedBase64: string | null;
};

const defaults: AdjustmentsStore = {
  showGenetic: false,
  originalBase64: null,
  processedBase64: null,
};

const {
  Provider: AdjustmentsProvider,
  useSetStore,
  useStoreSelector: useAdjustmentsStoreSelector,
} = createLocalStorageStoreNg<AdjustmentsStore>(defaults, 'adjustmentsStore');

export const useAdjustments = () => {
  const setSetting = useSetStore();

  return {
    setSetting,
  };
};

export { AdjustmentsProvider, useAdjustmentsStoreSelector };
