import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { Settings } from 'lucide-react';

export default function SettingsWindowToggle() {
  const { setSetting } = useSettings()
  const showSettings = useSettingsStoreSelector((state) => state.showSettings);

  const handleOnChange = () => setSetting((prev) => ({ ...prev, showSettings: !prev.showSettings}));

  return <>
    <GenericToggleButtonGroup variant="standard" id="settings-toggle" items={[
      {
        kbd: 'Alt+s',
        meta: {
          name: 'Settings',
          description: 'Toggle the settings window',
          icon: <Settings />,
          group: 'Tools'
        },
        tooltip: 'Toggle Settings Modal',
        icon: <Settings />,
        onClick: () => handleOnChange(),
        selected: showSettings,
      },
    ] as GenericToggleButtonProps[]} />
  </>
}
