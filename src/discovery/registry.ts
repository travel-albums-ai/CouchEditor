import type { ComponentType } from 'react';

export class BaseRegistry<T extends { id: string }> {
  protected items = new Map<string, T>();

  register(meta: T) {
    const existing = this.items.get(meta.id);

    if (existing) {
      // Heuristic duplicate detection: if loader or path differs, warn and skip
      // @ts-expect-error possible missing 'loader' property on narrow type
      if ('loader' in existing && 'loader' in meta && existing['loader'] !== meta['loader']) {

        console.warn(`Duplicate id '${meta.id}' detected. Skipping registration.`);
        return;
      }

      // @ts-expect-error possible missing 'path' property on narrow type
      if ('path' in existing && 'path' in meta && existing['path'] !== meta['path']) {

        console.warn(`Duplicate id '${meta.id}' detected. Skipping registration.`);
        return;
      }
    }

    this.items.set(meta.id, meta);
  }

  has(id: string) {
    return this.items.has(id);
  }

  get(id: string) {
    return this.items.get(id) ?? null;
  }

  all() {
    return [...this.items.values()];
  }
}

export class AsyncComponentRegistry<T extends { loader: () => Promise<{ default: ComponentType }> }> extends BaseRegistry<T> {
  private componentCache = new WeakMap<T['loader'], ComponentType>();
  private preloadCache = new WeakMap<T['loader'], Promise<ComponentType>>();

  async preload(meta: T) {
    const cached = this.componentCache.get(meta.loader);

    if (cached) {
      return cached;
    }

    const inFlight = this.preloadCache.get(meta.loader);

    if (inFlight) {
      return inFlight;
    }

    const loading = meta.loader()
      .then((mod) => {
        this.componentCache.set(meta.loader, mod.default);
        return mod.default;
      })
      .finally(() => {
        this.preloadCache.delete(meta.loader);
      });

    this.preloadCache.set(meta.loader, loading);
    return loading;
  }

  preloadAll(metas: T[]) {
    return Promise.all(metas.map((meta) => this.preload(meta)));
  }

  resolve(meta: T) {
    return this.componentCache.get(meta.loader) ?? null;
  }
}
