import { loadGlobEntries } from '@/discovery/globLoader';
import type { ToolMeta } from '@/discovery/registryTypes';
import { toolRegistry } from '@/discovery/toolRegistry';
import { processLoadedEntries } from '@/discovery/utils';

const modules = import.meta.glob<ToolMeta | undefined>(['../middleware/tools/**/*.meta.ts', '../middleware/base/**/*.meta.ts'], {
  import: 'meta',
});

let discoveryPromise: Promise<ToolMeta[]> | null = null;

async function loadToolMetadata() {
  const items = await loadGlobEntries<ToolMeta | undefined>(modules);

  return await processLoadedEntries<ToolMeta | undefined, ToolMeta>(items, {
    validate: (path, meta) => {
      if (!meta) {
        console.warn(`${path} does not export 'meta'`);
        return null;
      }

      if (typeof meta.id !== 'string' || meta.id.length === 0) {
        console.warn(`${path} has invalid tool meta id`);
        return null;
      }

      if (typeof meta.loader !== 'function') {
        console.warn(`${path} has invalid tool meta loader`);
        return null;
      }

      if (!Array.isArray(meta.tool)) {
        console.warn(`${path} has invalid tool entries`);
        return null;
      }

      for (const entry of meta.tool) {
        if (typeof entry.id !== 'string' || entry.id.length === 0) {
          console.warn(`${path} has tool entry with invalid group id`);
          return null;
        }

        if (entry.side !== 'left' && entry.side !== 'right') {
          console.warn(`${path} has tool entry with invalid side`);
          return null;
        }

        if (entry.priority !== undefined && typeof entry.priority !== 'number') {
          console.warn(`${path} has tool entry with invalid priority`);
          return null;
        }

        if (entry.visible !== undefined && typeof entry.visible !== 'function') {
          console.warn(`${path} has tool entry with invalid visible predicate`);
          return null;
        }
      }

      if (meta.enabled === false) {
        console.warn(`${path} is disabled`);
        return null;
      }

      return meta as ToolMeta;
    },
    register: (m) => toolRegistry.register(m),
    preload: async (ms) => toolRegistry.preloadAll(ms),
    missingMessage: "does not export 'meta'",
    failedMessage: 'Failed to load module during discovery',
  });
}

export function ensureToolDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = loadToolMetadata().catch((error) => {
    // Allow subsequent calls to retry when discovery or preload fails.
    discoveryPromise = null;
    throw error;
  });

  return discoveryPromise;
}

export async function ensureToolGroupPreload(group: string) {
  await ensureToolDiscovery();
  const metas = toolRegistry.tool(group);
  await toolRegistry.preloadAll(metas);
}
