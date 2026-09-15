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
