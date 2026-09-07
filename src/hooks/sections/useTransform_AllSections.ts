import { SectionType } from '@/hooks/sections/sectionTypes';
import { GalleryPhoto } from '@/lib/galleryData';

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
