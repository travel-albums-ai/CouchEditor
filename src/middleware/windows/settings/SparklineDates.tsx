import { usePhotosByDay } from '@/hooks/useTransform_PhotosByDays';
import { GalleryPhoto } from '@/lib/galleryData';
import SparklinePhotos from '@/middleware/windows/settings/components/SparklinePhotos';
import { useMemo } from 'react';

export default function SparklineDates({ photos, photosFiltered }: { photos?: GalleryPhoto[]; photosFiltered?: GalleryPhoto[] }) {
  const photosByDays = usePhotosByDay(photos || []);
  const photosByDaysFiltered = usePhotosByDay(photosFiltered || []);

  const sparklineData = useMemo(
    () =>
      photosByDays.reduce<Record<string, number>>((acc, curr) => {
        acc[curr.label] = curr.photos.length;
        return acc;
      }, {}),
    [photosByDays]
  );

  const sparklineDataFiltered = useMemo(
    () =>
      photosByDaysFiltered.reduce<Record<string, number>>((acc, curr) => {
        acc[curr.label] = curr.photos.length;
        return acc;
      }, {}),
    [photosByDaysFiltered]
  );

  return (
    <SparklinePhotos
      data={sparklineData}
      dataFiltered={sparklineDataFiltered}
      width={415}
      height={100}
    />
  );
}
