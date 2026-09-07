import { loadGlobEntries } from '@/discovery/globLoader';
import type { ThemeMeta } from '@/discovery/registryTypes';
import { themeRegistry } from '@/discovery/themeRegistry';
import { processLoadedEntries } from '@/discovery/utils';

const modules = import.meta.glob<Record<string, any>>(['../themes/**/*.theme.ts', '../themes/*.theme.ts']);

let discoveryPromise: Promise<ThemeMeta[]> | null = null;

function basenameFromPath(path: string) {
  const parts = path.split('/');
  const file = parts[parts.length - 1];
  return file.replace(/\.theme\.ts$/, '');
}

async function loadThemeModules() {
  const items = await loadGlobEntries<Record<string, any>>(modules);

  return await processLoadedEntries<Record<string, any>, ThemeMeta>(items, {
    validate: (path, mod) => {
      if (!mod) {
        console.warn(`${path} did not export a theme`);
        return null;
      }

      const name = mod?.default?.name ?? mod?.name ?? mod?.themeName ?? basenameFromPath(path);
      const id = String(name).replace(/\s+/g, '-').toLowerCase();

      const meta: ThemeMeta = {
        id,
        name,
        loader: () => Promise.resolve(mod),
        path,
        module: mod,
      };

      return meta;
    },
    register: (m) => themeRegistry.register(m),
    missingMessage: 'did not export a theme',
    failedMessage: 'Failed to load theme module during discovery',
  });
}

export function ensureThemeDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = loadThemeModules().catch((error) => {
    discoveryPromise = null;
    throw error;
  });

  return discoveryPromise;
}
