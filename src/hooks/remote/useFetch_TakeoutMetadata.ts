import { useSettings } from '@/context/settingsStore';
import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { benchmarkFunction } from '@/hooks/utils';
import { GalleryPhoto } from '@/lib/galleryData';
import { processMetadata } from '@/lib/useProcessedImages.utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';
import { useCallback } from 'react';

const CACHE_VERSION = 1;
const LOCALFORAGE_KEY = `takeout-metadata-v${CACHE_VERSION}`;

const URLS = {
  live: `${SERVER_ORIGIN}/takeout-metadata`,
  demo: 'https://pub-f25bd1b7b4224c528cffe81410a9bf3e.r2.dev/metadata.json',
};

/**
 * Streams the response body and parses NDJSON lines as chunks arrive,
 * instead of buffering the whole payload via response.text() first.
 * Saves peak memory and lets JSON.parse work overlap with network I/O.
 */
async function parseNDJSONStream(body: ReadableStream<Uint8Array>): Promise<Record<string, unknown>> {
  const raw: Record<string, unknown> = Object.create(null);
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const consumeLine = (line: string) => {
    if (line.length === 0) return;
    const obj = JSON.parse(line) as Record<string, unknown>;
    // Avoids Object.keys(obj)[0], which allocates a throwaway array per line.
    for (const key in obj) {
      raw[key] = obj[key];
      break;
    }
  };

  while (true) {
    const { done, value } = await reader.read();

    if (value) {
      buffer += decoder.decode(value, { stream: true });

      let start = 0;
      let idx: number;
      while ((idx = buffer.indexOf('\n', start)) !== -1) {
        consumeLine(buffer.slice(start, idx));
        start = idx + 1;
      }
      // Keep only the trailing partial line for the next chunk.
      buffer = start > 0 ? buffer.slice(start) : buffer;
    }

    if (done) {
      buffer += decoder.decode(); // flush any remaining decoder state
      if (buffer.length) consumeLine(buffer);
      break;
    }
  }

  return raw;
}

/**
 * Dedupes on (title, takenAtTs) using a nested Map<title, Set<ts>>
 * instead of a Set<string> keyed by a concatenated template string.
 * Avoids allocating + hashing one long composite string per photo.
 */
function dedupePhotos(processed: GalleryPhoto[]): GalleryPhoto[] {
  const seen = new Map<string, { index: number; keyCount: number }>();
  const result: GalleryPhoto[] = [];

  for (const photo of processed) {
    const key = `${photo.title ?? ''}\0${photo.takenAtTs ?? ''}`;
    const keyCount = Object.keys(photo).length;

    const existing = seen.get(key);

    if (existing === undefined) {
      seen.set(key, {
        index: result.length,
        keyCount,
      });
      result.push(photo);
      continue;
    }

    if (keyCount > existing.keyCount) {
      result[existing.index] = photo;
      existing.keyCount = keyCount;
    }
  }

  return result;
}

async function fetchAndProcess(
  setSetting: any,
  forceRefresh = false,
): Promise<GalleryPhoto[]> {
  return benchmarkFunction(async () => {
    setSetting((prev: any) => ({ ...prev, loading: true }));

    if (!forceRefresh) {
      const cached = await localforage.getItem<GalleryPhoto[]>(LOCALFORAGE_KEY);

      if (cached) {
        setSetting((prev: any) => ({ ...prev, loading: false }));
        return cached;
      }
    }

    const response = await fetch(URLS.live, { cache: 'no-store'});

    if (!response.ok) { throw new Error(`Fetch failed: ${response.status}`) }
    if (!response.body) { throw new Error('Response has no body stream') }

    const raw = await parseNDJSONStream(response.body);
    const processed = processMetadata(raw);
    const uniquePhotos = dedupePhotos(processed ?? []);

    await localforage.setItem(LOCALFORAGE_KEY, uniquePhotos);

    setSetting((prev: any) => ({ ...prev, loading: false }));

    return uniquePhotos;
  }, '💾☁️ Metadata', []);
}

export function useFetch_TakeoutMetadata() {
  const queryClient = useQueryClient();
  const { setSetting } = useSettings();

  const query = useQuery({
    queryKey: ['takeout-metadata'],
    queryFn: () => fetchAndProcess(setSetting),
    staleTime: Infinity,
    gcTime: Infinity,
    notifyOnChangeProps: ['data', 'error', 'status'],
  });

  const forceRefresh = useCallback(async () => {
    const data = await fetchAndProcess(setSetting, true);

    queryClient.setQueryData(
      ['takeout-metadata'],
      data,
    );

    return data;
  }, [queryClient, setSetting]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    forceRefresh,
  };
}
