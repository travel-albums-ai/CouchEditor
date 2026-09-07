import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import {
  Columns2,
  Columns3,
  Columns4
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ScrollerColumnsToggle() {
  const { setSetting } = useSettings()

  const scrollerColumns = useSettingsStoreSelector((state) => state.scrollerColumns)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      value: '2',
      tooltip: t('scrollerColumns2'),
      onClick: () => setSetting((prev) => ({...prev, scrollerColumns: 2})),
      icon: <Columns2 />,
      selected: scrollerColumns === 2,
    },
    {
      value: '3',
      tooltip: t('scrollerColumns3'),
      onClick: () => setSetting((prev) => ({...prev, scrollerColumns: 3})),
      icon: <Columns3 />,
      selected: scrollerColumns === 3,
    },
    {
      value: '4',
      tooltip: t('scrollerColumns4'),
      onClick: () => setSetting((prev) => ({...prev, scrollerColumns: 4})),
      icon: <Columns4 />,
      selected: scrollerColumns === 4,
    },
  ] satisfies GenericToggleButtonProps[]} />
}
