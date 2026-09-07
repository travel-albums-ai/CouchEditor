import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { MessagesSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PreviewCommentsToggle() {
  const { setSetting } = useSettings()
  const showPreviewComments = useSettingsStoreSelector((state) => state.showPreviewComments)
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('togglePreviewComments'),
      onClick: () => setSetting((prev) => ({...prev, showPreviewComments: !prev.showPreviewComments})),
      icon: <MessagesSquare size={20} />,
      selected: showPreviewComments,
      disabled: previewPhotoObj?.social?.length === 0,
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}
