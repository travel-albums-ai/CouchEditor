import { GalleryPhoto } from '@/lib/galleryData';

const SERVER_ORIGIN = import.meta.env.VITE_TAKEOUT_SERVER_ORIGIN?.trim() || 'http://localhost:3001'

const BASE_URL_THUMBNAILS = `${SERVER_ORIGIN}/thumbnails`
const BASE_URL_IMAGES = `${SERVER_ORIGIN}/images`

export const composeUrl = (photo: GalleryPhoto, original = false) => {
  const composePath = `${photo.rootIndex}/${encodeURIComponent(photo.folder ?? '')}/${encodeURIComponent(photo.title ?? '')}`
  return original
    ? `${BASE_URL_IMAGES}/${composePath}`
    : `${BASE_URL_THUMBNAILS}/${composePath}`
}
