import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsWindowToggle() {
  const { setSetting } = useSettings()
  const showSettings = useSettingsStoreSelector((state) => state.showSettings);
  const { t } = useTranslation()

  const handleOnChange = () => setSetting((prev) => ({ ...prev, showSettings: !prev.showSettings}));

  return <>
    <GenericToggleButtonGroup variant="standard" id="settings-toggle" items={[
      {
        kbd: 'Alt+s',
        meta: {
          name: t('settingsName'),
          description: t('settingsDescription'),
          icon: <Settings />,
          group: t('toolsGroup')
        },
        tooltip: t('settingsToggleTooltip'),
        icon: <Settings />,
        onClick: () => handleOnChange(),
        selected: showSettings,
      },
    ] as GenericToggleButtonProps[]} />
  </>
}
