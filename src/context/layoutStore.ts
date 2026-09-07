import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';



type LayoutStore = {
  layoutModel: any; // Replace 'any' with the actual type of your layout model if available
};

const defaults: LayoutStore = {
  layoutModel: {
    global: {
      tabEnableClose: false,
    },
    borders: [
      {
        type: 'border',
        location: 'left',
        selected: 0,
        size: 400,
        minSize: 350,
        children: [
          { type: 'tab', name: 'drawerExplorer', component: 'sidebarDrawer' },
          { type: 'tab', name: 'drawerFiles', component: 'filesDrawer' },
        ],
      },
      {
        type: 'border',
        location: 'right',
        size: 550,
        minSize: 550,
        children: [
          { type: 'tab', name: 'drawerPreview', component: 'previewDrawer' },
          { type: 'tab', name: 'drawerAdjustments', component: 'adjustmentsDrawer' },
          { type: 'tab', name: 'drawerLabeler', component: 'labelerDrawer' },
        ],
      },
    ],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          weight: 50,
          children: [
            { type: 'tab', name: 'drawerMain', component: 'outletDrawer' },
            { type: 'tab', name: 'drawerGlobe', component: 'globeDrawer' },
            { type: 'tab', name: 'drawerScroller', component: 'scrollerDrawer' },
            { type: 'tab', name: 'drawerRows', component: 'rowsDrawer' },
            { type: 'tab', name: 'drawerCalendar', component: 'calendarDrawer' },
            { type: 'tab', name: 'drawerFolderHandlers', component: 'folderHandlersDrawer' },
          ],
        },
      ],
    },
  },
};

const {
  Provider: LayoutProvider,
  useSetStore,
  useStoreSelector: useLayoutStoreSelector,
} = createLocalStorageStoreNg<LayoutStore>(defaults, 'layoutStore');

export const useLayout = () => {
  const setSetting = useSetStore();

  return {
    setSetting,
    setLayoutModel: (model: any) => { // Replace 'any' with the actual type of your layout model if available
      setSetting(prev => ({
        ...prev,
        layoutModel: model,
      }));
    }
  };
};

export { LayoutProvider, useLayoutStoreSelector };
