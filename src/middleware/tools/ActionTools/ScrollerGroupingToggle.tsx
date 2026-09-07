import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { CheckCheck, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ScrollerGroupingToggle() {
  const { setSetting } = useSettings()
  const scrollerGrouping = useSettingsStoreSelector((state) => state.scrollerGroupedByBatches)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('toggleScrollerGrouping'),
      kbd: 'Shift+G',
      meta: {
        name: t('toggleScrollerGroupingName'),
        description: t('toggleScrollerGroupingDescription'),
        icon: <CheckCheck />,
        group: 'Scroller Grouping'
      },
      icon: scrollerGrouping ? <CheckCheck /> : <Square />,
      onClick: () => setSetting((prev) => ({ ...prev, scrollerGroupedByBatches: !prev.scrollerGroupedByBatches })),
      selected: scrollerGrouping,
    },
  ] satisfies GenericToggleButtonProps[]} />
}
