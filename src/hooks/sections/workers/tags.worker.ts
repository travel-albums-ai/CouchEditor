import { benchmarkFunction } from '@/hooks/utils';
import { GalleryPhoto } from '@/lib/galleryData';

type Album = { name: string; color: string; photos: GalleryPhoto[] };

function iterate(photoMap: Map<string, GalleryPhoto>, taggedPhotos: tagsSettings['taggedPhotos']): Map<string, GalleryPhoto[]> {
  const tagPhotosMap = new Map<string, GalleryPhoto[]>();

  for (const taggedPhoto of taggedPhotos) {
    const photo = photoMap.get(taggedPhoto.id);
    if (!photo) continue;

    for (const tagId of taggedPhoto.tags ?? []) {
      let arr = tagPhotosMap.get(tagId);
      if (!arr) {
        arr = [];
        tagPhotosMap.set(tagId, arr);
      }
      arr.push(photo);
    }
  }

  return tagPhotosMap;
}

function compose(tags: tagsSettings['tags'], tagPhotosMap: Map<string, GalleryPhoto[]>): Album[] {
  return tags
    .map(tag => ({
      name: tag.name,
      color: tag.color,
      photos: tagPhotosMap.get(tag.id) ?? [],
    }))
    .filter(tag => tag.photos.length > 0);
}

export default function tagsWorker(
  photos: GalleryPhoto[],
  tagsSettings: any
) {
  if (!photos?.length) return [];

  const photoMap = new Map(photos.map(photo => [photo.id, photo]));

  return benchmarkFunction(
    () => compose(tagsSettings.tags, iterate(photoMap, tagsSettings.taggedPhotos)),
    '🤖 tagsWorker',
    [`${photos.length} photos`]);
}
