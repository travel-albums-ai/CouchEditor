import { benchmarkFunctionAsync } from '@/hooks/utils';

export type LoadEntry<T> = {
  path: string;
  value?: T;
  error?: any;
};

export async function loadGlobEntries<T>(
  modules: Record<string, () => Promise<T | undefined>>,
  timeoutMs = 5000,
): Promise<LoadEntry<T>[]> {
  const entries = Object.entries(modules);

  const withTimeout = <P>(promise: Promise<P>, ms: number): Promise<P> => {
    if (ms <= 0) return promise;

    return new Promise<P>((resolve, reject) => {
      const id = setTimeout(() => reject(new Error('loader timeout')), ms);

      promise.then(
        (value) => {
          clearTimeout(id);
          resolve(value);
        },
        (error) => {
          clearTimeout(id);
          reject(error);
        },
      );
    });
  };

  return benchmarkFunctionAsync(
    () =>
      Promise.all(
        entries.map(async ([path, loader]) => {
          try {
            return {
              path,
              value: await withTimeout(loader(), timeoutMs),
            };
          } catch (error) {
            return {
              path,
              error,
            };
          }
        }),
      ),
    '👀 loadGlobEntries',
    [
      `${entries.length} modules`,
      `${entries
        .map(([path]) => path.split('/').pop()?.replaceAll('.meta.ts', ''))
        .join(', ')} loaded`,
    ],
  );
}
