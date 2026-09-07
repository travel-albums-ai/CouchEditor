import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { CheckCheck, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SelectModeToggle() {
  const { setSetting } = useSettings()
  const selectMode = useSettingsStoreSelector((state) => state.selectMode)
  const { t } = useTranslation()

  const handleSelectModeToggle = () => {
    setSetting((prev) => ({ ...prev, selectMode: !prev.selectMode }));
  }

  return <>
    <WebMCPDataRun
      name="toggle_select_mode"
      description="Toggle the select mode setting."
      execute={async () => {
        handleSelectModeToggle();
        return 'Select mode ' + (!selectMode ? 'enabled' : 'disabled') + '.';
      }}
    />

    <GenericToggleButtonGroup items={[
      {
        id: "selectMode",
        group: ['general'],
        tooltip: t('toggleSelectMode'),
        kbd: 'Shift+S',
        meta: {
          name: t('toggleSelectModeName'),
          description: t('toggleSelectModeDescription'),
          icon: <CheckCheck />,
          group: 'Select Mode'
        },
        icon: selectMode ? <CheckCheck /> : <Square />,
        onClick: () => handleSelectModeToggle(),
        selected: selectMode,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
