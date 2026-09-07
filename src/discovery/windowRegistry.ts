import { AsyncComponentRegistry } from './registry';
import type { WindowMeta } from './registryTypes';

class WindowRegistry extends AsyncComponentRegistry<WindowMeta> {
  list() {
    return this.all();
  }
}

export const windowRegistry = new WindowRegistry();
