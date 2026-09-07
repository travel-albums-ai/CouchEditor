import countriesJSON from '@/data/countries.json';
import { benchmarkFunction } from '@/hooks/utils';

export interface PhotoWithLatLong {
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

const EMPTY_ARRAY: NearbyPlaceGroup[] = [];
const CELL_SIZE = 1;

function cellKey(latCell: number, lonCell: number) {
  return `${latCell}:${lonCell}`;
}

function findNearestAirport(lat: number, lon: number, airportGrid: Map<string, Airport[]>): Airport | undefined {
  const latCell = Math.floor(lat / CELL_SIZE);
  const lonCell = Math.floor(lon / CELL_SIZE);

  let nearest: Airport | undefined;
  let minDistSq = Infinity;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const bucket = airportGrid.get(cellKey(latCell + dy, lonCell + dx));
      if (!bucket) continue;

      for (const airport of bucket) {
        const dLat = airport.lat - lat;
        const dLon = airport.lon - lon;
        const distSq = dLat * dLat + dLon * dLon;

        if (distSq < minDistSq) {
          minDistSq = distSq;
          nearest = airport;
        }
      }
    }
  }

  return nearest;
}

function iterate(photos: PhotoWithLatLong[]): Map<string, PhotoWithLatLong[]> {
  const countryMap = new Map<string, PhotoWithLatLong[]>();

  for (const photo of photos) {
    const lat = photo.latitude;
    const lon = photo.longitude;

    if (typeof lat !== 'number' || typeof lon !== 'number') continue;
    if (lat === 0 && lon === 0) continue;

    const country = photo?.city?.country;

    let bucket = countryMap.get(country);
    if (!bucket) {
      bucket = [];
      countryMap.set(country, bucket);
    }
    bucket.push(photo);
  }

  return countryMap;
}

function compose(countryMap: Map<string, PhotoWithLatLong[]>, countryLookup: Map<string, string>): NearbyPlaceGroup[] {
  const result: NearbyPlaceGroup[] = [];

  for (const [country, photos] of countryMap) {
    result.push({
      avatar: country,
      name: countryLookup.get(country) || country,
      photos,
    });
  }

  return result;
}

export default function countriesWorker(
  photos: PhotoWithLatLong[]): any[] {
  if (!photos?.length) return EMPTY_ARRAY;

  const countryLookup = new Map(countriesJSON.data.countries.map((c) => [c.country, c.countryName]));

  return benchmarkFunction(
    () => compose(iterate(photos), countryLookup),
    '🤖 countryWorker',
    [`${photos.length} photos`]);
}
