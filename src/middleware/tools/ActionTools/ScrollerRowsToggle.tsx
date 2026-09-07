import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import {
  Columns2,
  Columns3,
  Columns4
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ScrollerRowsToggle() {
  const { setSetting } = useSettings()

  const scrollerRows = useSettingsStoreSelector((state) => state.scrollerRows)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      value: '2',
      tooltip: t('scrollerRows2'),
      onClick: () => setSetting((prev) => ({...prev, scrollerRows: 2})),
      icon: <Columns2 style={{ transform: 'rotate(90deg)' }} />,
      selected: scrollerRows === 2,
    },
    {
      value: '3',
      tooltip: t('scrollerRows3'),
      onClick: () => setSetting((prev) => ({...prev, scrollerRows: 3})),
      icon: <Columns3 style={{ transform: 'rotate(90deg)' }} />,
      selected: scrollerRows === 3,
    },
    {
      value: '4',
      tooltip: t('scrollerRows4'),
      onClick: () => setSetting((prev) => ({...prev, scrollerRows: 4})),
      icon: <Columns4 style={{ transform: 'rotate(90deg)' }} />,
      selected: scrollerRows === 4,
    },
  ] satisfies GenericToggleButtonProps[]} />
}
