import type { LoadEntry } from '@/discovery/globLoader';

export type Validator<T, M> = (path: string, value: T) => M | null;

export type ProcessOptions<T, M> = {
  validate: Validator<T, M>;
  register: (meta: M) => void;
  preload?: (metas: M[]) => Promise<any>;
  missingMessage?: string;
  failedMessage?: string;
};

export async function processLoadedEntries<T, M>(
  items: LoadEntry<T>[],
  options: ProcessOptions<T, M>,
): Promise<M[]> {
  const { validate, register, preload, missingMessage, failedMessage } = options;

  const metas: M[] = [];

  for (const item of items) {
    const { path, value, error } = item as { path: string; value?: T; error?: any };

    if (error) {
      console.warn(failedMessage ?? `${path} failed to load:`, error);
      continue;
    }

    if (!value) {
      console.warn(missingMessage ?? `${path} did not export expected value`);
      continue;
    }

    const meta = validate(path, value as T);
    if (!meta) {
      // validate should have already logged details when appropriate
      continue;
    }

    try {
      register(meta);
      metas.push(meta);
    } catch (err) {
      console.warn(`${path} failed to register:`, err);
    }
  }

  if (preload) {
    void preload(metas).catch((err) => {
      console.warn('Component warm preload failed', err);
    });
  }

  return metas;
}
