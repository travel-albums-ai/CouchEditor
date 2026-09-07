import { useFavoritesStoreSelector } from '@/context/favoritesStore';
import { useFilterStoreSelector } from '@/context/filterStore';
import { useFilteredGpsPhotos_GLOBAL } from '@/context/globals/filteredGpsPhotosStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import { useIgnoredStoreSelector } from '@/context/ignoredStore';
import { useLabelsStoreSelector } from '@/context/labelsStore';
import { usePrivateStoreSelector } from '@/context/privateStore';
import { useSelectedStoreSelector } from '@/context/selectedStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { useSidebarStoreSelector } from '@/context/sidebarStore';
import { useTagsStoreSelector } from '@/context/tagsStore';
import albumsWorker from '@/hooks/sections/workers/albums.worker';
import citiesWorker from '@/hooks/sections/workers/cities.worker';
import countriesWorker from '@/hooks/sections/workers/countries.worker';
import workerFilterByKey from '@/hooks/sections/workers/filterByKey.worker';
import grouperWorker from '@/hooks/sections/workers/grouper.worker';
import labelsWorker from '@/hooks/sections/workers/labels.worker';
import nowAndThenWorker from '@/hooks/sections/workers/nowAndThen.worker';
import peopleAndPetsWorker from '@/hooks/sections/workers/peopleGrouping.worker';
import tagsWorker from '@/hooks/sections/workers/tags.worker';
import timelineWorker from '@/hooks/sections/workers/timeline.worker';
import { benchmarkFunction } from '@/hooks/utils';
import { GalleryPhoto } from '@/lib/galleryData';
import { useMemo } from 'react';
import { SectionType } from './sectionTypes';

export interface SectionCover {
  title: string,
  data: any
}

export interface Section {
  type: SectionType,
  data: any,
  preview?: boolean,
  secondary?: boolean,
  topData?: GalleryPhoto[],
  cover?: SectionCover
}

function useSection(enabled: boolean, compute: () => any[], deps: DependencyList): any[] {
  // deps is a dynamic dependency list; disable the lint rule that requires
  // an array literal for this specific line.
  // eslint-disable-next-line react-hooks/use-memo
  return useMemo(() => (enabled ? compute() : []), [enabled, ...deps]);
}

export function useFilteredSections(forced = false): Section[] {
  const photos = useFilteredPhotos_GLOBAL();
  const rawPhotos = useUnfilteredPhotos_GLOBAL();
  const photosGps = useFilteredGpsPhotos_GLOBAL();

  const modules = useSettingsStoreSelector(s => s.modules);
  const sortOrder = useFilterStoreSelector(s => s.sortOrder);
  const favoritePhotoIds = useFavoritesStoreSelector(s => s.photos)
  const labelsPrimary = useLabelsStoreSelector(s => s.labelsPrimary)
  const ignoredPhotoIds = useIgnoredStoreSelector(s => s.photos)
  const privatePhotoIds = usePrivateStoreSelector(s => s.photos)
  const selectedPhotos = useSelectedStoreSelector(s => s.photos)
  const tagsStore = useTagsStoreSelector(s => s);

  const sidebarOpen = useSidebarStoreSelector((s) => s.sidebarOpen);

  const hasData = !!photos?.length && !!rawPhotos?.length && !!photosGps?.length;

  const gate = (cond: boolean) => hasData && cond;

  const peopleAndPetsData = useSection(gate(modules.peopleAndPets && (forced || sidebarOpen.peopleAndPets)), () => peopleAndPetsWorker(photos), [photos]);
  const nowAndThenData = useSection(gate(modules.nowAndThen && sidebarOpen.nowAndThen), () => nowAndThenWorker(photos), [photos]);
  const foldersData = useSection(gate(modules.folders && sidebarOpen.folders), () => albumsWorker(photos, sortOrder), [photos, sortOrder]);
  const citiesData = useSection(gate(modules.cities && (forced || sidebarOpen.cities)), () => citiesWorker(photosGps), [photosGps]);
  const countriesData = useSection(gate(modules.countries && (forced || sidebarOpen.countries)), () => countriesWorker(photosGps), [photosGps]);
  const viewedData = useSection(gate(modules.views && (forced || sidebarOpen.views)), () => workerFilterByKey(photos, SectionType.Views), [photos]);
  const timelineData = useSection(gate(modules.timeline && sidebarOpen.timeline), () => timelineWorker(photos), [photos]);
  const mostLikedData = useSection(gate(modules.likes && (forced || sidebarOpen.likes)), () => workerFilterByKey(photos, SectionType.Likes), [photos]);
  const mostCommentedData = useSection(gate(modules.comments && (forced || sidebarOpen.comments)), () => workerFilterByKey(photos, SectionType.Comments), [photos]);
  const favoritesData = useSection(gate(modules.favorites && sidebarOpen.favorites), () => grouperWorker(photos, favoritePhotoIds, 'Your favorites'), [photos, favoritePhotoIds]);
  const tagsData = useSection(gate(modules.tags && sidebarOpen.tags), () => tagsWorker(photos, tagsStore), [photos, tagsStore]);
  const labelsData = useSection(gate(modules.labels && sidebarOpen.labels), () => labelsWorker(photos, labelsPrimary), [photos, labelsPrimary]);
  const ignoredData = useSection(gate(modules.ignored), () => grouperWorker(rawPhotos, ignoredPhotoIds, 'Your ignored'), [rawPhotos, ignoredPhotoIds]);
  const privateData = useSection(gate(modules.private), () => grouperWorker(rawPhotos, privatePhotoIds, 'Your private'), [rawPhotos, privatePhotoIds]);
  const selectedData = useSection(gate(modules.selected), () => grouperWorker(rawPhotos, selectedPhotos, 'Your selected'), [rawPhotos, selectedPhotos]);

  return useMemo(() => {
    if (!hasData) return [];

    return benchmarkFunction(() => ([
      { type: SectionType.PeopleAndPets, data: peopleAndPetsData, preview: true },
      { type: SectionType.NowAndThen, data: nowAndThenData },
      { type: SectionType.Folders, data: foldersData },
      { type: SectionType.Cities, preview: true, data: citiesData },
      { type: SectionType.Countries, preview: true, data: countriesData },
      { type: SectionType.Views, data: viewedData },
      { type: SectionType.Timeline, data: timelineData },
      { type: SectionType.Likes, data: mostLikedData },
      { type: SectionType.Comments, data: mostCommentedData },
      { type: SectionType.Favorites, data: favoritesData },
      { type: SectionType.Tags, data: tagsData, preview: true },
      { type: SectionType.Labels, data: labelsData },
      { type: SectionType.Ignored, data: ignoredData },
      { type: SectionType.Private, data: privateData },
      { type: SectionType.Selected, data: selectedData },
    ] satisfies Section[]), 'useFilteredSections', [`${photos?.length ?? 0} photos`]);
  }, [
    hasData, peopleAndPetsData, nowAndThenData, foldersData, citiesData,
    countriesData, viewedData, timelineData, mostLikedData, mostCommentedData,
    favoritesData, tagsData, labelsData, ignoredData, privateData, selectedData,
    photos,
  ]);
}
