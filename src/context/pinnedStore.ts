import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import { useMemo } from 'react';

type Pin = { type_name: string; id: string };

type PinnedStore = {
  pins: Pin[];
};

const defaults: PinnedStore = {
  pins: [],
};

const {
  Provider: PinnedProvider,
  useSetStore,
  useStoreSelector: usePinnedStoreSelector,
} = createLocalStorageStoreNg<PinnedStore>(defaults, 'pinnedStore');

const pinKey = (pin: Pin) => `${pin.type_name}::${pin.id}`;

const pinSetCache = new WeakMap<Pin[], Set<string>>();
const getPinSet = (pins: Pin[]) => {
  let set = pinSetCache.get(pins);
  if (!set) {
    set = new Set(pins.map(pinKey));
    pinSetCache.set(pins, set);
  }
  return set;
};

export const usePinned = () => {
  const setSetting = useSetStore();

  return useMemo(() => ({
    add: (pin: Pin) => {
      const key = pinKey(pin);
      setSetting((prev) =>
        prev.pins.some((p) => pinKey(p) === key)
          ? prev
          : { ...prev, pins: [...prev.pins, pin] }
      );
    },
    remove: (pin: Pin) => {
      const key = pinKey(pin);
      setSetting((prev) => ({ ...prev, pins: prev.pins.filter((p) => pinKey(p) !== key) }));
    },
  }), [setSetting]);
};

export const usePinned_isPinned = (pin: Pin) => {
  const key = pinKey(pin);
  return usePinnedStoreSelector((state) => getPinSet(state.pins).has(key));
};

export { PinnedProvider, usePinnedStoreSelector };
