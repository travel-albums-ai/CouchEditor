import { benchmarkFunction } from '@/hooks/utils';
import { GalleryPhoto } from '@/lib/galleryData';

type Album = { name: string; photos: GalleryPhoto[] };

function iterate(photos: GalleryPhoto[], idSet: Set<string>): GalleryPhoto[] {
  const bucket: GalleryPhoto[] = [];

  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    if (idSet.has(p.id)) bucket.push(p);
  }

  return bucket;
}

function compose(photos: GalleryPhoto[], name: string): Album[] {
  return [{ name, photos }];
}

export default function grouperWorker(
  photos: GalleryPhoto[],
  photoIds: string[],
  key = 'Your favorites'
) {
  if (!photoIds?.length || !photos?.length) return [];

  const idSet = new Set(photoIds);

  return benchmarkFunction(
    () => compose(iterate(photos, idSet), key),
    '🤖 grouperWorker',
    [`${photos.length} photos`, `key: ${key}`]);
}
