import { benchmarkFunction } from '@/hooks/utils';
import type { GalleryPhoto } from '@/lib/galleryData';

export type PersonGroup = {
  name: string;
  photos: GalleryPhoto[];
  details: string[];
  description: string;
};

function buildGroups(photos: GalleryPhoto[]): PersonGroup[] {
  const groups = new Map<string, GalleryPhoto[]>();

  for (let i = 0, l = photos.length; i < l; i++) {
    const photo = photos[i];
    const people = photo.people;
    if (!people) continue;

    for (let j = 0, pl = people.length; j < pl; j++) {
      const p = people[j];
      const key = typeof p === 'string' ? p : p?.name || 'Unknown';

      const arr = groups.get(key);
      if (arr) arr.push(photo);
      else groups.set(key, [photo]);
    }
  }

  const result: PersonGroup[] = new Array(groups.size);
  let i = 0;

  for (const [name, photos] of groups) {
    const count = photos.length;

    const details =
      count > 1000
        ? ['Best friend', `${count} photos`]
        : count > 100
          ? ['Good friend', `${count} photos`]
          : count > 10
            ? ['Acquaintance', `${count} photos`]
            : [`${count} photo${count !== 1 ? 's' : ''}`];

    result[i++] = {
      name,
      photos,
      details,
      description: details[0],
    };
  }

  return result;
}

export default function peopleAndPetsWorker(photos: GalleryPhoto[]): PersonGroup[] {
  if (!photos?.length) return [];

  return benchmarkFunction(
    () => buildGroups(photos),
    '🤖 peopleAndPetsWorker',
    [`${photos.length} photos`]);
}
