import { benchmarkFunction } from '@/hooks/utils';
import { GalleryPhoto } from '@/lib/galleryData';
type BucketId = 0 | 1 | 2 | 3;

const BUCKET_NAMES = ['over 100', 'over 50', 'over 10', '10 or less'] as const;

// Monomorphic accessor: chosen once outside the hot loop instead of
// doing `(photo as any)[keyName]` per element (megamorphic lookup).
function getAccessor(key: string): (p: GalleryPhoto) => unknown {
  switch (key) {
    case 'views': return (p) => p.views;
    case 'likes': return (p) => p.likes;
    case 'comments': return (p) => p.comments;
  }
}

function bucketOf(value: number): BucketId | -1 {
  if (value <= 0) return -1;
  if (value > 100) return 0;
  if (value > 50) return 1;
  if (value > 10) return 2;
  return 3;
}

export default function workerFilterByKey(photos: GalleryPhoto[], key: string) {
  if (!photos?.length) return [];

  return benchmarkFunction(
    () => {
      const get = getAccessor(key);
      const n = photos.length;

      // Pass 1: one property read per photo, classify + count.
      const counts = [0, 0, 0, 0];
      const ids = new Int8Array(n); // -1..3 scratch buffer, cheap
      for (let i = 0; i < n; i++) {
        const v = get(photos[i]);
        const id = typeof v === 'number' ? bucketOf(v) : -1;
        ids[i] = id;
        if (id !== -1) counts[id]++;
      }

      // Pass 2: exact-size allocation (no push/grow reallocation),
      // plus a parallel Float64Array so the sort never touches objects.
      const bucketPhotos: GalleryPhoto[][] = counts.map(c => new Array(c));
      const bucketValues: Float64Array[] = counts.map(c => new Float64Array(c));
      const cursors = [0, 0, 0, 0];

      for (let i = 0; i < n; i++) {
        const id = ids[i];
        if (id === -1) continue;
        const c = cursors[id]++;
        bucketPhotos[id][c] = photos[i];
        bucketValues[id][c] = get(photos[i]) as number; // 2nd read, only for kept items
      }

      // Pass 3: sort each bucket's *index order* against a flat numeric
      // array — comparator touches Float64Array slots, never GalleryPhoto.
      const result: { name: string; photos: GalleryPhoto[] }[] = [];
      for (let id = 0; id < 4; id++) {
        const count = counts[id];
        if (count === 0) continue;

        const values = bucketValues[id];
        const arr = bucketPhotos[id];
        const order = new Array(count);
        for (let i = 0; i < count; i++) order[i] = i;
        order.sort((a, b) => values[b] - values[a]);

        const sorted = new Array<GalleryPhoto>(count);
        for (let i = 0; i < count; i++) sorted[i] = arr[order[i]];
        result.push({ name: BUCKET_NAMES[id], photos: sorted });
      }

      return result;
    },
    '🤖 filterByKeyWorker',
    [`${photos.length} photos`, `key: ${key}`]
  );
}
