import { benchmarkFunction } from '@/hooks/utils';
import { GalleryPhoto } from '@/lib/galleryData';

type Album = { name: string; photos: GalleryPhoto[] };

function iterate(photos: GalleryPhoto[]): Map<string, GalleryPhoto[]> {
  const albums = new Map<string, GalleryPhoto[]>();

  for (const photo of photos) {
    const key = photo.albumName || 'Unknown Album';
    let bucket = albums.get(key);
    if (!bucket) {
      bucket = [];
      albums.set(key, bucket);
    }
    bucket.push(photo);
  }

  return albums;
}

function compose(albums: Map<string, GalleryPhoto[]>, reverse: boolean): Album[] {
  const result: Album[] = [];

  for (const [name, bucket] of albums) {
    result.push({
      name,
      photos: reverse ? bucket.reverse() : bucket,
    });
  }

  return result;
}

export default function albumsWorker(
  photos: GalleryPhoto[],
  sortOrder: 'newestFirst' | 'oldestFirst'
) {
  if (!photos?.length) return [];

  return benchmarkFunction(
    () => compose(iterate(photos), sortOrder !== 'newestFirst'),
    '🤖 albumsWorker',
    [`${photos.length} photos`]);
}
