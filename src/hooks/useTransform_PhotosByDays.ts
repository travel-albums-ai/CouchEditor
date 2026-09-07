import type { GalleryPhoto } from '@/lib/galleryData';
import { useMemo } from 'react';

export type PhotosByDayGroup = {
  label: string
  photos: GalleryPhoto[]
  batches: Record<string, GalleryPhoto[]>
}

const UNKNOWN = 'Unknown Date'

const toDayLabel = (p: GalleryPhoto): string => {
  if (p.takenAtTs > 0) {
    const d = new Date(p.takenAtTs * 1000)
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  const parts = p.takenAt?.split(',').slice(0, 2).map(s => s.trim()).filter(Boolean)
  return parts?.length ? parts.join(', ') : UNKNOWN
}

const groupBy = <T,>(
  arr: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> =>
    arr.reduce<Record<string, T[]>>((acc, item) => {
      const k = keyFn(item)
    ;(acc[k] ??= []).push(item)
      return acc
    }, {})

const primaryGridPhotosByBatch = (photos: GalleryPhoto[]) =>
  groupBy(photos, (p) => p.batch ?? 'no-batch')

export const selectPhotosByDay = (photos: GalleryPhoto[]): PhotosByDayGroup[] => {
  const grouped = groupBy(photos, toDayLabel)

  return Object.entries(grouped).map(([label, photos]) => ({
    label,
    photos,
    batches: primaryGridPhotosByBatch(photos),
  }))
}

export const usePhotosByDay = (photos: GalleryPhoto[]) =>
  useMemo(() => selectPhotosByDay(photos), [photos])
