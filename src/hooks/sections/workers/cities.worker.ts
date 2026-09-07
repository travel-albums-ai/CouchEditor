import countriesJSON from '@/data/countries.json';
import { benchmarkFunction } from '@/hooks/utils';

export interface PhotoWithLatLong {
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

type NearbyPlaceGroup = {
  name: string;
  avatar?: string;
  photos: PhotoWithLatLong[];
};

const EMPTY_ARRAY: NearbyPlaceGroup[] = [];

// Higher = more granular (each city separate). Lower = cities merge into metro areas.
// 0.5° ≈ ~55km grid, 1° ≈ ~110km, 2° ≈ ~220km
const GROUPING_RESOLUTION = 0.75;
const INV_RES = 1 / GROUPING_RESOLUTION;

const countryLookup = new Map(
  countriesJSON.data.countries.map((c) => [c.country, c.countryName])
);

function getOrCreateGroup(
  map: Map<string, NearbyPlaceGroup>,
  key: string,
  name: string,
  country?: string
): NearbyPlaceGroup {
  let group = map.get(key);

  if (!group) {
    group = {
      name: country
        ? `${name}, ${countryLookup.get(country) || country}`
        : name,
      avatar: country,
      photos: []
    };

    map.set(key, group);
  }

  return group;
}

function processPhoto(photo: PhotoWithLatLong, placeMap: Map<string, NearbyPlaceGroup>) {
  const lat = photo.latitude;
  const lon = photo.longitude;

  if (typeof lat !== 'number' || typeof lon !== 'number') return;
  if (lat === 0 && lon === 0) return;

  const meta = photo.city;

  if (!meta?.name) {
    // Fallback: bucket by grid cell only, no city name available
    const gridLat = Math.round(lat * INV_RES);
    const gridLon = Math.round(lon * INV_RES);
    const key = `geo|${gridLat}|${gridLon}`;
    const country = meta?.country;
    const fallbackName = country
      ? countryLookup.get(country) || country
      : `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`;

    const group = getOrCreateGroup(placeMap, key, fallbackName, country);
    group.photos.push(photo);
    return;
  }

  const gridLat = Math.round(lat * INV_RES);
  const gridLon = Math.round(lon * INV_RES);
  const key = `${gridLat}|${gridLon}|${meta.country}`;

  const group = getOrCreateGroup(placeMap, key, meta.name, meta.country);
  group.photos.push(photo);
}

function iterate(photos: PhotoWithLatLong[], placeMap: Map<string, NearbyPlaceGroup>) {
  for (let i = 0; i < photos.length; i++) {
    processPhoto(photos[i], placeMap);
  }
}

function compose(placeMap: Map<string, NearbyPlaceGroup>): NearbyPlaceGroup[] {
  const nameMap = new Map<string, NearbyPlaceGroup>();

  for (const group of placeMap.values()) {
    const existing = nameMap.get(group.name);
    if (existing) {
      existing.photos.push(...group.photos);
    } else {
      nameMap.set(group.name, group);
    }
  }

  return Array.from(nameMap.values());
}

export default function citiesWorker(
  photos: PhotoWithLatLong[],
): NearbyPlaceGroup[] {
  if (!photos?.length) return EMPTY_ARRAY;

  return benchmarkFunction(
    () => {
      const placeMap = new Map<string, NearbyPlaceGroup>();
      iterate(photos, placeMap);
      return compose(placeMap);
    },
    '🤖 citiesWorker',
    [`${photos.length} photos`]);
}
