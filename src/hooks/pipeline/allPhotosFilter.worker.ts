import { FilterStore } from '@/context/filterStore';
import { GalleryPhoto } from '@/lib/galleryData';

// ---------------------------------------------------------------------------
// Worker-only compact representation.
//
// A GalleryPhoto carries many fields (paths, thumbnails, tags, people[],
// albumIds[], etc.) that the filter never reads. Holding the whole object
// graph in the worker just to look at 7 primitives per photo is the actual
// source of the 90MB — structured-clone duplicates every one of those
// fields into the worker's heap on INIT_PHOTOS, and it never gets released.
//
// Converting to a struct-of-arrays on ingest means: fixed ~25 bytes/photo
// in typed arrays instead of a full boxed object per photo, and the raw
// GalleryPhoto[] payload becomes unreachable (GC-able) right after
// conversion since we never store it.
// ---------------------------------------------------------------------------
type PhotoIndex = {
  ids: string[];        // still needed verbatim for Set lookups
  lat: Float32Array;    // NaN sentinel = "no GPS" (undefined in source)
  lng: Float32Array;
  hasPersons: Uint8Array;
  views: Int32Array;
  likes: Int32Array;
  comments: Int32Array;
  takenAtTs: Uint32Array; // seconds since epoch fits comfortably in uint32
  n: number;
};

function buildPhotoIndex(raw: GalleryPhoto[]): PhotoIndex {
  const n = raw.length;
  const ids = new Array<string>(n);
  const lat = new Float32Array(n);
  const lng = new Float32Array(n);
  const hasPersons = new Uint8Array(n);
  const views = new Int32Array(n);
  const likes = new Int32Array(n);
  const comments = new Int32Array(n);
  const takenAtTs = new Uint32Array(n);

  for (let i = 0; i < n; i++) {
    const p = raw[i];
    ids[i] = p.id;
    lat[i] = p.latitude === undefined ? NaN : p.latitude;
    lng[i] = p.longitude === undefined ? NaN : p.longitude;
    hasPersons[i] = (p.people?.length ?? 0) > 0 ? 1 : 0;
    views[i] = p.views;
    likes[i] = p.likes;
    comments[i] = p.comments;
    takenAtTs[i] = p.takenAtTs;
  }

  return { ids, lat, lng, hasPersons, views, likes, comments, takenAtTs, n };
}

function filterPhotoIndex(
  index: PhotoIndex,
  settings: FilterStore,
  excludedPhotos: Set<string>,
): Uint32Array {
  const {
    showWithWithoutPersons,
    showWithWithoutGps,
    showViews,
    showViewsMin,
    showLikes,
    showLikesMin,
    showComments,
    showCommentsMin,
    filterDates,
    filterCountries,
    filterFolders,
    filterPeopleAndPets,
    dates,
    sections,
    filterGps,
    sortOrder,
    gps,
  } = settings;

  // Scan indices directly instead of allocating a filtered copy of `dates`.
  const activeDateIdx: number[] = [];
  if (filterDates) {
    for (let i = 0; i < dates.length; i++) {
      if (dates[i].active) activeDateIdx.push(i);
    }
  }
  const datesLen = activeDateIdx.length;

  const activeSections: { isInclude: boolean; set: Set<string> }[] = [];
  const sectionKeys = Object.keys(sections);
  for (let k = 0; k < sectionKeys.length; k++) {
    const key = sectionKeys[k];
    if (key === 'peopleAndPets' && !filterPeopleAndPets) continue;
    if (key === 'folders' && !filterFolders) continue;
    if (key === 'countries' && !filterCountries) continue;

    const section = sections[key];
    if (section.included.length > 0 && section.includedPhotos) {
      activeSections.push({ isInclude: true, set: section.includedPhotos });
    }
    if (section.excluded.length > 0 && section.excludedPhotos) {
      activeSections.push({ isInclude: false, set: section.excludedPhotos });
    }
  }
  const sectionsLen = activeSections.length;

  const { ids, lat, lng, hasPersons, views, likes, comments, takenAtTs, n } = index;
  const reversed = sortOrder !== 'newestFirst';

  const matched = new Uint32Array(n);
  let count = 0;

  for (let idx = 0; idx < n; idx++) {
    const i = reversed ? n - 1 - idx : idx;
    const photoId = ids[i];

    if (excludedPhotos.has(photoId)) continue;

    if (filterGps) {
      const la = lat[i];
      const lo = lng[i];
      if (la === 0 && lo === 0) continue;
      if (Number.isNaN(la) && Number.isNaN(lo)) continue;
      if (la < gps.south || la > gps.north || lo < gps.west || lo > gps.east) continue;
    }

    if (showWithWithoutPersons !== null) {
      const has = hasPersons[i] === 1;
      if (showWithWithoutPersons ? has : !has) continue;
    }

    if (showWithWithoutGps !== null) {
      const has = !Number.isNaN(lat[i]) && !Number.isNaN(lng[i]);
      if (showWithWithoutGps ? has : !has) continue;
    }

    if (showViews && views[i] < showViewsMin) continue;
    if (showLikes && likes[i] < showLikesMin) continue;
    if (showComments && comments[i] < showCommentsMin) continue;

    if (datesLen > 0) {
      const ts = takenAtTs[i] * 1000;
      let inRange = false;
      for (let j = 0; j < datesLen; j++) {
        const d = dates[activeDateIdx[j]];
        if (ts >= d.startDate && ts <= d.endDate) { inRange = true; break; }
      }
      if (!inRange) continue;
    }

    let sectionFailed = false;
    for (let j = 0; j < sectionsLen; j++) {
      const { isInclude, set } = activeSections[j];
      if (isInclude ? !set.has(photoId) : set.has(photoId)) {
        sectionFailed = true;
        break;
      }
    }
    if (sectionFailed) continue;

    matched[count++] = i;
  }

  return matched.subarray(0, count);
}

// ---------------------------------------------------------------------------
// Worker state
// ---------------------------------------------------------------------------
type Filters = {
  settings: FilterStore;
  privatePhotos: string[];
  ignoredPhotos: string[];
};

let photoIndex: PhotoIndex | null = null;
let filters: Filters | null = null;

let photosDirty = false;
let filtersDirty = false;

// Cache the excluded-photos Set and only rebuild it when the source arrays
// actually change reference (Redux selectors keep the same array reference
// when the underlying data hasn't changed, so this is usually a no-op skip).
let excludedCache: Set<string> | null = null;
let excludedPrivateRef: string[] | null = null;
let excludedIgnoredRef: string[] | null = null;

function getExcluded(privatePhotos: string[], ignoredPhotos: string[]) {
  if (
    excludedCache &&
    excludedPrivateRef === privatePhotos &&
    excludedIgnoredRef === ignoredPhotos
  ) {
    return excludedCache;
  }
  const set = new Set(privatePhotos);
  for (let i = 0; i < ignoredPhotos.length; i++) {
    set.add(ignoredPhotos[i]);
  }
  excludedCache = set;
  excludedPrivateRef = privatePhotos;
  excludedIgnoredRef = ignoredPhotos;
  return set;
}

function recompute() {
  if (!filters || !photoIndex || !photoIndex.n) return;
  if (!photosDirty && !filtersDirty) return;
  photosDirty = false;
  filtersDirty = false;

  const excluded = getExcluded(filters.privatePhotos, filters.ignoredPhotos);
  const indices = filterPhotoIndex(photoIndex, filters.settings, excluded);

  self.postMessage(indices, [indices.buffer]);
}

self.onmessage = (e) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'INIT_PHOTOS': {
      // `raw` is scoped to this block only — once buildPhotoIndex() returns,
      // nothing in the worker still references the full GalleryPhoto[]
      // payload, so it's eligible for GC instead of living for the worker's
      // whole lifetime.
      const raw: GalleryPhoto[] = payload;
      photoIndex = buildPhotoIndex(raw);
      photosDirty = true;
      recompute();
      break;
    }

    case 'UPDATE_FILTERS':
      filters = payload;
      filtersDirty = true;
      recompute();
      break;
  }
};
