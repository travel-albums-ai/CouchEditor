import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { Turtle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PerformanceToggle() {
  const { setSetting } = useSettings()
  const performanceMode = useSettingsStoreSelector((state) => state.performanceMode);
  const { t } = useTranslation()

  const handleOnChange = (mode?: boolean) => {
    setSetting((prev) => ({ ...prev, performanceMode: !mode }))
  }

  return <>
    <GenericToggleButtonGroup variant="standard" id="performance-toggle" items={[
      {
        tooltip: t('togglePerformanceTooltip'),
        icon: <Turtle />,
        onClick: () => handleOnChange(performanceMode),
        selected: performanceMode,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
