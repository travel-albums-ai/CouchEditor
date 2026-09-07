import { benchmarkFunction } from '@/hooks/utils';
import type { GalleryPhoto } from '@/lib/galleryData';

type GooglePhotoMetadata = {
  title?: string
  description?: string
  imageViews?: string
  people?: GalleryPhoto['people']
  creationTime?: { timestamp?: string; formatted?: string }
  photoTakenTime?: { timestamp?: string; formatted?: string }
  latitude?: number
  longitude?: number
  social?: GalleryPhoto['social']
  url?: string
}

const process = (rawMetadata: Record<string, GooglePhotoMetadata>) => {

  const photos: GalleryPhoto[] = []

  for (const key in rawMetadata) {
    const data = rawMetadata[key]

    let likes = 0
    let comments = 0

    const social = data.social || []

    for (let i = 0; i < social.length; i++) {
      const item = social[i]

      if (item.liked) likes++
      if (item.text) comments++
    }

    const { timestamp, formatted, tiny, ...rest } = data

    const photo: GalleryPhoto = {
      ...rest,
      id: `${data.folder}__${data.id}`,
      albumName: data.folder,
      title: data.id,
      batch: '',
      imageUrl: `/src/Takeout/${data.folder}/${data.id}`,
      people: data.people || [],
      social,
      likes,
      comments,
      city: { country: data.country || '', name: data.city || '' },
      views: Number(data.views || 0),
      takenAt: data.formatted,
      takenAtTs: data.timestamp,
    }

    if (typeof data.latitude === 'number') {
      photo.latitude = data.latitude
    }

    if (typeof data.longitude === 'number') {
      photo.longitude = data.longitude
    }

    photos.push(photo)
  }

  return photos.sort((a, b) => b.takenAtTs - a.takenAtTs)
}

export const processMetadata = (
  rawMetadata: Record<string, GooglePhotoMetadata>
): GalleryPhoto[] => {
  return benchmarkFunction(() => {
    return process(rawMetadata)
  }, '⚙️ processMetadata', [`${Object.keys(rawMetadata).length} photos`])

}
