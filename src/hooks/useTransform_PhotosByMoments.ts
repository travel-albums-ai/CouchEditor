import type { GalleryPhoto } from '@/lib/galleryData';
import { useMemo } from 'react';

export type PhotosByLocationGroup = {
  label: string;
  photos: GalleryPhoto[];
};

export type PhotosByMomentGroup = {
  label: string;
  photos: GalleryPhoto[];
  locations: PhotosByLocationGroup[];
};

export type PhotosByDayGroup = {
  label: string;
  moments: PhotosByMomentGroup[];
};

const UNKNOWN = 'Unknown Date';
const DEFAULT_MOMENT_GAP_MINUTES = 60;
const DEFAULT_LOCATION_RADIUS_KM = 2;

const toTimestamp = (p: GalleryPhoto): number => {
  if (p.takenAtTs > 0) return p.takenAtTs;

  const date = new Date(p.takenAt ?? '');
  return isNaN(date.getTime()) ? 0 : date.getTime() / 1000;
};

const toDayLabel = (p: GalleryPhoto): string => {
  const ts = toTimestamp(p);

  if (ts > 0) {
    const d = new Date(ts * 1000);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }

  const parts = p.takenAt
    ?.split(',')
    .slice(0, 2)
    .map(s => s.trim())
    .filter(Boolean);

  return parts?.length ? parts.join(', ') : UNKNOWN;
};

const groupBy = <T>(
  arr: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> =>
    arr.reduce<Record<string, T[]>>((acc, item) => {
      const key = keyFn(item);
      (acc[key] ??= []).push(item);
      return acc;
    }, {});

const formatMomentLabel = (photo: GalleryPhoto): string => {
  const ts = toTimestamp(photo);

  if (!ts) return 'Unknown Time';

  return new Date(ts * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getCoordinates = (
  photo: GalleryPhoto,
): { latitude: number; longitude: number } | null => {
  const latitude = Number(photo.latitude);
  const longitude = Number(photo.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
};

const distanceKm = (
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number => {
  const R = 6371;

  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);

  const h =
    sinLat * sinLat +
    Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;

  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const formatLocationLabel = (photo: GalleryPhoto): string => {
  const coordinates = getCoordinates(photo);

  if (!coordinates) return 'Unknown Location';

  return `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`;
};

const groupIntoLocations = (
  photos: GalleryPhoto[],
  radiusKm: number,
): PhotosByLocationGroup[] => {
  const groups: PhotosByLocationGroup[] = [];

  let current: GalleryPhoto[] = [];
  let center: { latitude: number; longitude: number } | null = null;

  for (const photo of photos) {
    const coordinates = getCoordinates(photo);

    // Photos without GPS go into their own group.
    if (!coordinates) {
      if (current.length) {
        groups.push({
          label: formatLocationLabel(current[0]),
          photos: current,
        });

        current = [];
        center = null;
      }

      groups.push({
        label: 'Unknown Location',
        photos: [photo],
      });

      continue;
    }

    if (!current.length) {
      current = [photo];
      center = coordinates;
      continue;
    }

    if (center && distanceKm(center, coordinates) <= radiusKm) {
      current.push(photo);
    } else {
      groups.push({
        label: formatLocationLabel(current[0]),
        photos: current,
      });

      current = [photo];
      center = coordinates;
    }
  }

  if (current.length) {
    groups.push({
      label: formatLocationLabel(current[0]),
      photos: current,
    });
  }

  return groups;
};

const groupIntoMoments = (
  photos: GalleryPhoto[],
  gapMinutes: number,
  locationRadiusKm: number,
): PhotosByMomentGroup[] => {
  const sorted = [...photos].sort(
    (a, b) => toTimestamp(a) - toTimestamp(b),
  );

  const moments: PhotosByMomentGroup[] = [];
  let current: GalleryPhoto[] = [];

  for (const photo of sorted) {
    if (!current.length) {
      current.push(photo);
      continue;
    }

    const previous = current[current.length - 1];

    const gapMinutesBetween =
      (toTimestamp(photo) - toTimestamp(previous)) / 60;

    if (gapMinutesBetween > gapMinutes) {
      moments.push({
        label: formatMomentLabel(current[0]),
        photos: current,
        locations: groupIntoLocations(current, locationRadiusKm),
      });

      current = [photo];
    } else {
      current.push(photo);
    }
  }

  if (current.length) {
    moments.push({
      label: formatMomentLabel(current[0]),
      photos: current,
      locations: groupIntoLocations(current, locationRadiusKm),
    });
  }

  return moments;
};

export const selectPhotosByDay = (
  photos: GalleryPhoto[],
  momentGapMinutes = DEFAULT_MOMENT_GAP_MINUTES,
  locationRadiusKm = DEFAULT_LOCATION_RADIUS_KM,
): PhotosByDayGroup[] => {
  const byDay = groupBy(photos, toDayLabel);

  return Object.entries(byDay).map(([label, dayPhotos]) => ({
    label,
    moments: groupIntoMoments(
      dayPhotos,
      momentGapMinutes,
      locationRadiusKm,
    ),
  }));
};

export const useTransform_PhotosByMoments = (
  photos: GalleryPhoto[],
  momentGapMinutes = DEFAULT_MOMENT_GAP_MINUTES,
  locationRadiusKm = DEFAULT_LOCATION_RADIUS_KM,
) =>
  useMemo(
    () =>
      selectPhotosByDay(
        photos,
        momentGapMinutes,
        locationRadiusKm,
      ),
    [photos, momentGapMinutes, locationRadiusKm],
  );
