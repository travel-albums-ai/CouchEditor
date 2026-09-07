import SettingsSection from '@/components/SettingsSection';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { ensureInterfaceDiscovery } from '@/discovery/interfaceDiscovery';
import { interfaceRegistry } from '@/discovery/interfaceRegistry';
import SettingToggleRow from '@/middleware/windows/settings/components/SettingToggleRow';
import { Ban, Check } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'sidebar', labelKey: 'Explorer', value: 'show-sidebar', type: 'boolean', disabled: true },
  { key: 'globe', labelKey: 'Globe', value: 'show-globe', type: 'boolean' },
  { key: 'outlet', labelKey: 'Main', value: 'show-outlet', type: 'boolean', disabled: true },
  { key: 'preview', labelKey: 'Preview', value: 'show-preview', type: 'boolean', disabled: true },
  { key: 'adjustments', labelKey: 'Adjustments', value: 'show-adjustments', type: 'boolean' },
  { key: 'scroller', labelKey: 'Scroller', value: 'show-scroller', type: 'boolean' },
  { key: 'rows', labelKey: 'Rows', value: 'show-rows', type: 'boolean' },
  { key: 'calendar', labelKey: 'Calendar', value: 'show-calendar', type: 'boolean' },
] as const

export default function DrawersPopover({ filter }: { filter?: string }) {
  const { setDrawer } = useSettings()
  const drawers = useSettingsStoreSelector((state) => state.drawers)
  const { t } = useTranslation()
  const [drawerDiscoveryReady, setDrawerDiscoveryReady] = useState(false);

  useEffect(() => {
    ensureInterfaceDiscovery().then(() => setDrawerDiscoveryReady(true));
  }, []);

  return <>
    <SettingsSection title="Drawers">
      {toggleControls
        .filter(control => !filter || t(control.labelKey).toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => t(a.labelKey).localeCompare(t(b.labelKey)))
        .sort((a, b) => (a.disabled !== b.disabled ? (a.disabled ? 1 : -1) : 0))
        .map((control) => {
          const Icon = drawerDiscoveryReady ? interfaceRegistry.get(control.key)?.icon : undefined;

          return <Fragment key={control.key}>
            {control.type === 'boolean' && <SettingToggleRow
              label={t(control.labelKey)}
              disabled={control.disabled ?? false}
              icon={Icon ? <Icon /> : undefined}
              inactiveIcon={control.disabled ? undefined : <Check size={16} />}
              activeIcon={control.disabled ? undefined : <Ban size={16} />}
              selected={drawers[control.key]}
              onChange={() => setDrawer(control.key, !drawers[control.key])}
            />}
          </Fragment>
        })}
    </SettingsSection>
  </>
}
