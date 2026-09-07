import { SectionType } from '@/hooks/sections/sectionTypes';
import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

const sidebarSections = Object.values(SectionType) as SectionType[];
type SidebarSection = SectionType;

type SidebarStore = {
  sortBy: 'name' | 'count' | 'original';
  sortAsc: boolean;
  sidebarOpen: Record<SidebarSection, boolean>;
};

const defaults: SidebarStore = {
  sortBy: 'name',
  sortAsc: true,
  sidebarOpen: Object.fromEntries(sidebarSections.map(section => [section, false])) as Record<SidebarSection, boolean>,
};

const {
  Provider: SidebarProvider,
  useSetStore,
  useStoreSelector: useSidebarStoreSelector,
} = createLocalStorageStoreNg<SidebarStore>(defaults, 'sidebarStore');

export const useSidebar = () => {
  const setSetting = useSetStore();

  return {
    setSetting,
    setSidebarOpen: (section: SidebarSection, value: boolean) => {
      setSetting(prev => ({
        ...prev,
        sidebarOpen: {
          ...prev.sidebarOpen,
          [section]: value,
        },
      }))
    }
  };
};

export { SidebarProvider, useSidebarStoreSelector };
