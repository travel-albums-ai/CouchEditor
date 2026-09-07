import { loadGlobEntries } from '@/discovery/globLoader';
import type { WindowMeta } from '@/discovery/registryTypes';
import { processLoadedEntries } from '@/discovery/utils';
import { windowRegistry } from '@/discovery/windowRegistry';

const modules = import.meta.glob<WindowMeta | undefined>('../middleware/windows/*.meta.ts', {
  import: 'meta',
});

let discoveryPromise: Promise<WindowMeta[]> | null = null;

async function loadWindowMetadata() {
  const items = await loadGlobEntries<WindowMeta | undefined>(modules);

  return await processLoadedEntries<WindowMeta | undefined, WindowMeta>(items, {
    validate: (path, meta) => {
      if (!meta) {
        console.warn(`${path} does not export 'meta'`);
        return null;
      }

      if (typeof meta.id !== 'string' || meta.id.length === 0) {
        console.warn(`${path} has invalid window meta id`);
        return null;
      }

      if (typeof meta.loader !== 'function') {
        console.warn(`${path} has invalid window meta loader`);
        return null;
      }

      return meta as WindowMeta;
    },
    register: (m) => windowRegistry.register(m),
    preload: async (ms) => Promise.allSettled(ms.map((m) => windowRegistry.preload(m))),
    missingMessage: "does not export 'meta'",
    failedMessage: 'Failed to load window module during discovery',
  });
}

export function ensureWindowDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = loadWindowMetadata().catch((error) => {
    discoveryPromise = null;
    throw error;
  });

  return discoveryPromise;
}
