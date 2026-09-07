import { benchmarkFunction } from '@/hooks/utils';
import { GalleryPhoto } from '@/lib/galleryData';

type Album = { name: string; photos: GalleryPhoto[] };

function iterate(photos: GalleryPhoto[]): Map<string, GalleryPhoto> {
  return new Map(photos.map(photo => [photo.id, photo]));
}

function compose(
  labelsPrimary: Record<string, string[]>,
  photoMap: Map<string, GalleryPhoto>
): Album[] {
  return Object.entries(labelsPrimary).map(([label, photoIds]) => ({
    name: label,
    photos: photoIds
      .map(id => photoMap.get(id))
      .filter((p): p is GalleryPhoto => !!p),
  }));
}

export default function labelsWorker(
  photos: GalleryPhoto[],
  labelsPrimary: Record<string, string[]>
) {
  if (!photos?.length) return [];

  return benchmarkFunction(
    () => compose(labelsPrimary, iterate(photos)),
    '🤖 labelsWorker',
    [`${photos.length} photos`]);
}
