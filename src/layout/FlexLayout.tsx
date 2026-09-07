import { useSettingsStoreSelector } from '@/context/settingsStore';
import { ensureInterfaceDiscovery } from '@/discovery/interfaceDiscovery';
import { interfaceRegistry } from '@/discovery/interfaceRegistry';
import { Box } from '@mui/material';
import {
  IJsonModel,
  ITabRenderValues,
  Layout,
  Model,
  TabNode,
} from 'flexlayout-react';


import GeneralRegistryDrawer from '@/components/registry/GeneralRegistryDrawer';
import i18n from '@/lib/i18n';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const tab = (
  label: string,
  component: string,
) => [{ type: 'tab', name: i18n.t(label), component }]

const STORAGE_KEY = 'flexlayout-model-v1';

const leftChildren = [
  ...tab('drawerExplorer', 'sidebar'),
]

const rightChildren = [
  ...tab('drawerPreview', 'preview'),
  ...tab('drawerAdjustments', 'adjustments'),
  ...tab('drawerAutoDescription', 'autoDescription'),
]

const layoutChildren = [
  ...tab('drawerDashboard', 'dashboard'),
  ...tab('drawerMain', 'outlet'),
  ...tab('drawerGlobe', 'globe'),
  ...tab('drawerScroller', 'scroller'),
  ...tab('drawerRows', 'rows'),
  ...tab('drawerCalendar', 'calendar'),

]

function createDefaultJson(): IJsonModel {
  return {
    global: {
      tabEnableClose: false,
      tabEnableRenderOnDemand: true,
    },
    borders: [
      {
        type: 'border',
        location: 'left',
        selected: 0,
        size: 400,
        minSize: 350,
        children: leftChildren,
      },
      {
        type: 'border',
        location: 'right',
        size: 550,
        minSize: 550,
        children: rightChildren,
      },
    ],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          weight: 50,
          children: layoutChildren,
        },
      ],
    },
  };
}

function loadModel(drawers: typeof drawers) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return Model.fromJson(cleanModel(JSON.parse(saved), drawers));
    }
  } catch (e) {
    console.warn('Failed to restore layout', e);
  }

  return Model.fromJson(cleanModel(createDefaultJson(), drawers));
}

function cleanModel(model: IJsonModel, drawers: typeof drawers): IJsonModel {
  const result = { ...model };

  const resultDrawers = {
    global: result.global,
    borders: result?.borders?.map(border => ({
      ...border,
      children: border?.children?.filter(child => drawers[child.component as keyof typeof drawers])
    })),
    layout: {
      ...result.layout,
      children: result?.layout?.children?.map(tabset => ({
        ...tabset,
        children: tabset?.children?.filter(child => drawers[child.component as keyof typeof drawers])
      })),
    },
  };

  return resultDrawers as IJsonModel;
}

export default function FlexLayout() {
  const drawers = useSettingsStoreSelector((s) => s.drawers);
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);

  const [drawerDiscoveryReady, setDrawerDiscoveryReady] = useState(false);

  useEffect(() => {
    ensureInterfaceDiscovery().then(() => setDrawerDiscoveryReady(true));
  }, []);

  const factory = useCallback((node: TabNode) => {
    const component = node.getComponent();
    return interfaceRegistry.has(component) ? <GeneralRegistryDrawer id={component} /> : null;
  }, []);

  const renderTab = useCallback((node: TabNode, renderValues: ITabRenderValues) => {
    const Icon = interfaceRegistry.get(node.getComponent())?.icon;
    renderValues.leading = Icon ? <Icon size={14} strokeWidth={2} aria-hidden="true" /> : null;
  }, []);

  const model = useMemo(
    () => drawerDiscoveryReady ? loadModel(drawers) : null,
    [drawers, drawerDiscoveryReady],
  );

  return (
    <>
      <Box
        className={themeMode === 'dark' ? 'flexlayout__theme_alpha_dark' : 'flexlayout__theme_light'}
        sx={{
          flexGrow: 1,
          mx: 0.5,
          position: 'relative',
        }}
      >
        {model && <Layout
          model={model}
          factory={factory}
          onRenderTab={renderTab}
          onModelChange={(newModel) => localStorage.setItem(STORAGE_KEY, JSON.stringify(newModel.toJson()))}
        />}
      </Box>
    </>
  );
}
