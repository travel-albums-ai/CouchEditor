import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { CheckCheck, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ScrollerOriginalToggle() {
  const { setSetting } = useSettings()
  const scrollerGrouping = useSettingsStoreSelector((state) => state.scrollerOriginal)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('toggleScrollerOriginal'),
      kbd: 'Shift+O',
      meta: {
        name: t('toggleScrollerOriginalName'),
        description: t('toggleScrollerOriginalDescription'),
        icon: <CheckCheck />,
        group: 'Scroller Grouping'
      },
      icon: scrollerGrouping ? <CheckCheck /> : <Square />,
      onClick: () => setSetting((prev) => ({ ...prev, scrollerOriginal: !prev.scrollerOriginal })),
      selected: scrollerGrouping,
    },
  ] satisfies GenericToggleButtonProps[]} />
}
