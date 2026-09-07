import { benchmarkFunction } from '@/hooks/utils';
import type { GalleryPhoto } from '@/lib/galleryData';

type TimelineGroup = {
  bucket: string;
  photos: GalleryPhoto[];
  name: string;
  details: string[];
  description: string;
};

const timelineItems = [
  { month: '01', name: 'January', description: ['Winter', 'Winter still here', 'Cold days'] },
  { month: '02', name: 'February', description: ['Winter', 'Still cold', 'Snowy days'] },
  { month: '03', name: 'March', description: ['Spring', 'Flowers bloom', 'Warmer days'] },
  { month: '04', name: 'April', description: ['Spring', 'Rainy days', 'Easter'] },
  { month: '05', name: 'May', description: ['Spring', 'Flowers', 'Warmer days'] },
  { month: '06', name: 'June', description: ['Summer', 'Sunny days', 'Vacation time'] },
  { month: '07', name: 'July', description: ['Summer', 'Hot days', 'Beach time'] },
  { month: '08', name: 'August', description: ['Summer', 'Hot days', 'Vacation time'] },
  { month: '09', name: 'September', description: ['Autumn', 'Cooler days', 'Back to school'] },
  { month: '10', name: 'October', description: ['Autumn', 'Halloween', 'Falling leaves'] },
  { month: '11', name: 'November', description: ['Autumn', 'Thanksgiving', 'Cooler days'] },
  { month: '12', name: 'December', description: ['Winter', 'Christmas', 'Cold days'] },
];

const itemMap = Object.fromEntries(timelineItems.map(i => [i.month, i]));

const MONTHS: Record<string, string> = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

export const getBucket = (takenAt: unknown): string => {
  if (typeof takenAt !== 'string') return 'unknown';

  if (takenAt.length >= 7 && takenAt[4] === '-') {
    return takenAt.slice(0, 7);
  }

  const yearStart = takenAt.indexOf(', ') + 2;
  if (yearStart < 2) return 'unknown';

  const year = takenAt.slice(yearStart, yearStart + 4);
  const month = MONTHS[takenAt.slice(0, 3)];

  if (!year || !month) return 'unknown';

  return `${year}-${month}`;
};

function buildTimeline(photos: GalleryPhoto[]): TimelineGroup[] {
  const grouped: Record<string, GalleryPhoto[]> = {};

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const bucket = getBucket((photo as any).takenAt);

    const arr = grouped[bucket];
    if (arr) arr.push(photo);
    else grouped[bucket] = [photo];
  }

  const keys = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  const result: TimelineGroup[] = new Array(keys.length);

  for (let i = 0; i < keys.length; i++) {
    const bucket = keys[i];
    const photos = grouped[bucket];

    const year = bucket.slice(0, 4);
    const month = bucket.slice(5, 7);

    const item = itemMap[month];
    const desc = item?.description;
    const name = item?.name || month;

    const randomDescription = desc
      ? desc[Math.floor(Math.random() * desc.length)]
      : '';

    result[i] = {
      bucket,
      photos,
      name: `${name} ${year}`,
      details: [randomDescription],
      description: randomDescription,
    };
  }

  return result;
}

export default function timelineWorker(photos: GalleryPhoto[]) {
  if (!photos?.length) return [];

  return benchmarkFunction(
    () => buildTimeline(photos),
    '🤖 timelineWorker',
    [`${photos.length} photos`]);
}
