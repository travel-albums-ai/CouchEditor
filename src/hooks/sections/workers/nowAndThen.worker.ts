import { benchmarkFunction } from '@/hooks/utils';
import type { GalleryPhoto } from '@/lib/galleryData';

export type Bucket = {
  key: string;
  name: string;
  photos: GalleryPhoto[];
};

const MONTHS: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

function extractParts(s: string) {
  const year = +s.slice(8, 12);
  const month = MONTHS[s.slice(0, 3)];
  const day = +s.slice(4, 6);

  if (!year || !month || !day) return null;
  return { year, month, day };
}

function makeKey(month: number, day: number) {
  return `${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
}

function buildTargetDays(today: Date): Set<string> {
  const set = new Set<string>();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const m = d.getMonth() + 1;
    const day = d.getDate();

    set.add(`${m < 10 ? '0' : ''}${m}-${day < 10 ? '0' : ''}${day}`);
  }

  return set;
}

type EngineResult = {
  current: GalleryPhoto[];
  byYear: Map<number, GalleryPhoto[]>;
};

function buildEngine(photos: GalleryPhoto[], targetDays: Set<string>, currentYear: number): EngineResult {
  const current: GalleryPhoto[] = [];
  const byYear = new Map<number, GalleryPhoto[]>();

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const taken = photo.takenAt;

    if (typeof taken !== 'string') continue;

    const parts = extractParts(taken);
    if (!parts) continue;

    const key = makeKey(parts.month, parts.day);
    if (!targetDays.has(key)) continue;

    if (parts.year === currentYear) {
      current.push(photo);
      continue;
    }

    const arr = byYear.get(parts.year);
    if (arr) arr.push(photo);
    else byYear.set(parts.year, [photo]);
  }

  return { current, byYear };
}

function buildBuckets(engine: EngineResult, currentYear: number): Bucket[] {
  const buckets: Bucket[] = [];

  if (engine.current.length) {
    buckets.push({
      key: `now-${currentYear}`,
      name: `This Week - ${currentYear}`,
      photos: engine.current,
    });
  }

  const years = Array.from(engine.byYear.keys()).sort((a, b) => b - a);

  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const photos = engine.byYear.get(year);

    if (!photos?.length) continue;

    buckets.push({
      key: `year-${year}`,
      name: `Same week - ${year}`,
      photos,
    });
  }

  return buckets;
}

export default function nowAndThenWorker(photos: GalleryPhoto[]): Bucket[] {
  if (!photos?.length) return [];

  return benchmarkFunction(
    () => {
      const today = new Date();
      const currentYear = today.getFullYear();

      const targetDays = buildTargetDays(today);
      const engine = buildEngine(photos, targetDays, currentYear);
      return buildBuckets(engine, currentYear);
    },
    '🤖 nowAndThenWorker',
    [`${photos.length} photos`]);
}
