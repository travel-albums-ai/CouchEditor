export interface ThemeMeta {
  id: string;
  name: string;
  loader: () => Promise<any>;
  path: string;
  module?: any;
}

export * from './registry';
