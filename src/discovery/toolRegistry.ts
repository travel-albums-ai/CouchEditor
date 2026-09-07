import { AsyncComponentRegistry } from './registry';
import type { ToolMeta } from './registryTypes';

class ToolRegistry extends AsyncComponentRegistry<ToolMeta> {
  private groupCache = new Map<string, ToolMeta[]>();
  private groupSideCache = new Map<string, ToolMeta[]>();

  private sidePriority(meta: ToolMeta, side: 'left' | 'right') {
    return meta.tool?.find((g) => g.side === side)?.priority ?? 0;
  }

  register(meta: ToolMeta) {
    const existing = this.get(meta.id);

    if (existing && existing.loader !== meta.loader) {

      console.warn(`Duplicate tool meta id '${meta.id}' detected. Skipping registration.`);
      return;
    }

    super.register(meta);
    this.groupCache.clear();
    this.groupSideCache.clear();
  }

  all() {
    return super.all();
  }

  tool(group: string) {
    const cached = this.groupCache.get(group);

    if (cached) {
      return cached;
    }

    const items = this.all().filter((x) => x.tool?.some((g) => g.id === group));

    this.groupCache.set(group, items);
    return items;
  }

  toolBySide(group: string, side: 'left' | 'right') {
    const cacheKey = `${group}:${side}`;
    const cached = this.groupSideCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const items = this.tool(group)
      .filter((x) => x.tool?.some((g) => g.side === side && g.id === group))
      .sort((a, b) => this.sidePriority(a, side) - this.sidePriority(b, side));

    this.groupSideCache.set(cacheKey, items);
    return items;
  }
}

export const toolRegistry = new ToolRegistry();
