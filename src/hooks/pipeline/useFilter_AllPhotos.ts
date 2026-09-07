import { useFilterStoreSelector } from '@/context/filterStore';
import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import { useIgnoredStoreSelector } from '@/context/ignoredStore';
import { usePrivateStoreSelector } from '@/context/privateStore';
import { GalleryPhoto } from '@/lib/galleryData';
import { useEffect, useMemo, useRef, useState } from 'react';

type WorkerMsg =
  | { type: 'INIT_PHOTOS'; payload: GalleryPhoto[] }
  | { type: 'UPDATE_FILTERS'; payload: any };

type WorkerResult = {
  generation: number;
  indices: Uint32Array;
};

export const useFilter_AllPhotos = (enabled = true) => {
  const rawPhotos = useUnfilteredPhotos_GLOBAL();
  const settings = useFilterStoreSelector(s => s);
  const privatePhotos = usePrivateStoreSelector(s => s.photos);
  const ignoredPhotos = useIgnoredStoreSelector(s => s.photos);

  const [indices, setIndices] = useState<Uint32Array>(
    new Uint32Array(0)
  );

  const workerRef = useRef<Worker | null>(null);

  // The exact photo array the worker's indices refer to.
  const indexedPhotosRef = useRef<GalleryPhoto[]>([]);
  const [indexedPhotos, setIndexedPhotos] = useState<GalleryPhoto[]>([]);

  // Changes every time we INIT_PHOTOS.
  const generationRef = useRef(0);

  // ------------------------------------------------------------
  // Worker lifecycle
  // ------------------------------------------------------------

  useEffect(() => {
    const worker = new Worker(
      new URL('./allPhotosFilter.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e: MessageEvent<Uint32Array>) => {
      setIndices(e.data);
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // ------------------------------------------------------------
  // RAW PHOTOS
  //
  // rawPhotos is allowed to change.
  // Every new array becomes the worker's new source of truth.
  // ------------------------------------------------------------

  useEffect(() => {
    if (!rawPhotos) {
      indexedPhotosRef.current = [];
      setIndices(new Uint32Array(0));
      return;
    }

    const worker = workerRef.current;
    if (!worker) return;

    const generation = ++generationRef.current;

    // IMPORTANT:
    // Update this BEFORE sending INIT_PHOTOS so that any result
    // produced for this generation maps against this exact array.
    indexedPhotosRef.current = rawPhotos;
    setIndexedPhotos(rawPhotos);

    // Clear the old result immediately.
    setIndices(new Uint32Array(0));

    worker.postMessage({
      type: 'INIT_PHOTOS',
      payload: rawPhotos,
    } satisfies WorkerMsg);

  }, [rawPhotos]);

  // ------------------------------------------------------------
  // FILTERS
  // ------------------------------------------------------------

  useEffect(() => {
    if (!enabled) {
      setIndices(new Uint32Array(0));
      return;
    }

    const worker = workerRef.current;
    if (!worker) return;

    worker.postMessage({
      type: 'UPDATE_FILTERS',
      payload: {
        settings,
        privatePhotos,
        ignoredPhotos,
      },
    } satisfies WorkerMsg);
  }, [
    enabled,
    settings,
    privatePhotos,
    ignoredPhotos,
  ]);

  // ------------------------------------------------------------
  // MAP INDICES -> PHOTOS
  // ------------------------------------------------------------

  const result = useMemo(() => {
    const photos = indexedPhotos;

    const out = new Array<GalleryPhoto>(indices.length);

    for (let i = 0; i < indices.length; i++) {
      out[i] = photos[indices[i]];
    }

    return out;
  }, [indices]);

  return result;
};
