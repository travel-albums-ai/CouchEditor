import type { ComponentType } from 'react';

export type ComponentLoader<T = any> = () => Promise<{ default: T }>;

export interface WindowMeta {
  id: string;
  loader: ComponentLoader<ComponentType>;
  enabled?: boolean;
}

export interface ToolComponentProps {
  context?: unknown;
}

export interface ToolMeta {
  id: string;

  enabled?: boolean;

  tool?: {
    id: string;
    side: 'left' | 'right';
    priority?: number;
    visible?: (_context: unknown) => boolean;
  }[];

  loader: ComponentLoader<ComponentType<ToolComponentProps>>;
}

export interface ThemeMeta {
  id: string;
  name: string;
  loader: () => Promise<any>;
  path: string;
  module?: any;
}

export interface InterfaceMeta {
  id: string;
  icon: any;
  loader: ComponentLoader<ComponentType>;
}

export * from './registry';
