import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { ensureThemeDiscovery } from '@/discovery/themeDiscovery';
import SettingSelectRow from '@/middleware/windows/settings/components/SettingSelectRow';
import { themeOptions } from '@/themes';
import { useEffect, useState } from 'react';

export default function ThemeMenu() {
  const themeId = useSettingsStoreSelector((state) => state.themeId);
  const { setSetting } = useSettings();

  const [options, setOptions] = useState<any[]>(() => themeOptions());

  useEffect(() => {
    let mounted = true;

    ensureThemeDiscovery().then(() => {
      if (!mounted) return;
      setOptions(themeOptions());
    }).catch(() => {
      if (!mounted) return;
      setOptions(themeOptions());
    });

    return () => { mounted = false };
  }, []);

  return (
    <SettingSelectRow
      label={''}
      value={themeId}
      options={options}
      onChange={(value) => {
        setSetting((prev) => ({
          ...prev,
          themeId: value,
        }));
      }}
    />
  );
}
