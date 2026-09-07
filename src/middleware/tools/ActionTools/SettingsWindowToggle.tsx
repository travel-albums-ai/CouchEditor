import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { Settings } from 'lucide-react';

export default function SettingsWindowToggle() {
  const { setSetting } = useSettings()
  const showSettings = useSettingsStoreSelector((state) => state.showSettings);

  const handleOnChange = () => setSetting((prev) => ({ ...prev, showSettings: !prev.showSettings}));

  return <>
    <WebMCPDataRun
      name="toggle_settings_modal"
      description="Toggle the settings modal visibility."
      execute={async () => {
        handleOnChange();
        return `Settings modal ${!showSettings ? 'shown' : 'hidden'}.`;
      }}
    />

    <GenericToggleButtonGroup variant="standard" id="settings-toggle" items={[
      {
        webMcp: true,
        tooltip: 'Toggle Settings Modal',
        icon: <Settings />,
        onClick: () => handleOnChange(),
        selected: showSettings,
      },
    ] as GenericToggleButtonProps[]} />
  </>
}
