import { AsyncComponentRegistry } from './registry';
import type { InterfaceMeta } from './registryTypes';

class InterfaceRegistry extends AsyncComponentRegistry<InterfaceMeta> {}

export const interfaceRegistry = new InterfaceRegistry();
