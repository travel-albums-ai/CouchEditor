import type { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';
import { useEffect, useState } from 'react';

const MAP_THUMBNAIL_MAX_PHOTOS = 320

type UseMapMarkerThumbnailsOptions = {
  priorityImageUrls?: string[]
}

const buildPrioritizedImageUrls = (
  photos: GalleryPhoto[],
  priorityImageUrls: string[],
): string[] => {
  const uniqueInOrder = Array.from(
    new Set(
      photos
        .map((photo) => photo.imageUrl)
        .filter((url): url is string => url !== null),
    ),
  )

  if (priorityImageUrls.length === 0) {
    return uniqueInOrder.slice(0, MAP_THUMBNAIL_MAX_PHOTOS)
  }

  const prioritySet = new Set(priorityImageUrls)
  const prioritized = uniqueInOrder.filter((url) => prioritySet.has(url))
  const remaining = uniqueInOrder.filter((url) => !prioritySet.has(url))

  return [...prioritized, ...remaining].slice(0, MAP_THUMBNAIL_MAX_PHOTOS)
}

export const useMapMarkerThumbnails = (
  photos: GalleryPhoto[],
  options: UseMapMarkerThumbnailsOptions = {},
) => {
  const [thumbnailByImageUrl, setThumbnailByImageUrl] = useState<Record<string, string>>({})
  const priorityImageUrls = options.priorityImageUrls ?? []
  const priorityKey = priorityImageUrls.join('|')

  useEffect(() => {
    const imageUrls = buildPrioritizedImageUrls(photos, priorityImageUrls)

    if (imageUrls.length === 0) {
      setThumbnailByImageUrl({})
      return
    }

    const resolvedMap = imageUrls.reduce<Record<string, string>>((acc, imageUrl) => {
      const photo = photos.find((candidate) => candidate.imageUrl === imageUrl)
      const thumbnailUrl = photo ? composeUrl(photo) : null
      if (thumbnailUrl) {
        acc[imageUrl] = thumbnailUrl
      }

      return acc
    }, {})

    setThumbnailByImageUrl(resolvedMap)
  }, [photos, priorityKey])

  return thumbnailByImageUrl
}
