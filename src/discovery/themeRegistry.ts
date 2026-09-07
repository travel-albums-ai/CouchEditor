import { BaseRegistry } from './registry';
import type { ThemeMeta } from './registryTypes';

class ThemeRegistry extends BaseRegistry<ThemeMeta> {
  register(meta: ThemeMeta) {
    const existing = this.get(meta.id);

    if (existing && existing.path !== meta.path) {

      console.warn(`Duplicate theme id '${meta.id}' detected. Skipping registration.`);
      return;
    }

    super.register(meta);
  }
}

export const themeRegistry = new ThemeRegistry();
