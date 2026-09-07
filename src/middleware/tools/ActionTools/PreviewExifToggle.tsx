import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { Braces } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PreviewExifToggle() {
  const { setSetting } = useSettings()
  const showPreviewExif = useSettingsStoreSelector((state) => state.showPreviewExif)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('togglePreviewExif'),
      onClick: () => setSetting((prev) => ({...prev, showPreviewExif: !prev.showPreviewExif})),
      icon: <Braces size={20} />,
      selected: showPreviewExif,
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}
