import { useSettingsStoreSelector } from '@/context/settingsStore';
import { useSidebarStoreSelector } from '@/context/sidebarStore';
import { SectionType } from '@/hooks/sections/sectionTypes';
import { useFilteredSections } from '@/hooks/sections/useFilteredSections';
import { GalleryPhoto } from '@/lib/galleryData';
import { useMemo } from 'react';

export interface SectionCover {
  title: string;
  data: any;
}

export interface Section {
  type: SectionType | string;
  title: string;
  data: any;
  preview?: boolean;
  secondary?: boolean;
  topData?: GalleryPhoto[];
  cover?: SectionCover;
}

export interface SectionItem {
  name: string;
  photos: GalleryPhoto[];
  details: string[];
}

export function useTransform_AllSections(forced = false): Section[] {
  const sortBy = useSidebarStoreSelector(s => s.sortBy);
  const sortAsc = useSidebarStoreSelector(s => s.sortAsc);
  const term = useSettingsStoreSelector(s => s.sidebarTerm)
    .trim()
    .toLowerCase();

  const filteredSections = useFilteredSections(forced);

  return useMemo(() => {
    let result = filteredSections;

    if (term) {
      result = filteredSections.reduce<Section[]>((acc, section) => {
        const data = section.data?.filter((item: SectionItem) =>
          item.name.toLowerCase().includes(term)
        );

        if (data?.length) {
          acc.push({
            ...section,
            data,
          });
        }

        return acc;
      }, []);
    }

    if (sortBy !== 'original') {
      const dir = sortAsc ? 1 : -1;

      result = result.map(section => ({
        ...section,
        data: [...(section.data ?? [])].sort(
          (a: SectionItem, b: SectionItem) => {
            switch (sortBy) {
              case 'name':
                return dir * a.name.localeCompare(b.name);

              case 'count':
                return dir * (a.photos.length - b.photos.length);

              default:
                return 0;
            }
          }
        ),
      }));
    }

    return result;
  }, [
    filteredSections,
    term,
    sortBy,
    sortAsc,
  ]);
}
