import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { MapPin, MapPinX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PreviewMapToggle() {
  const { setSetting } = useSettings()
  const showPreviewMap = useSettingsStoreSelector((state) => state.showPreviewMap)
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)
  const { t } = useTranslation()

  const photo = previewPhotoObj ?? null

  return <GenericToggleButtonGroup items={[
    {
      value: 'cover',
      tooltip: t('togglePreviewMap'),
      onClick: () => setSetting((prev) => ({...prev, showPreviewMap: !prev.showPreviewMap})),
      icon: showPreviewMap ? <MapPin size={20} /> : <MapPinX size={20} />,
      selected: showPreviewMap,
      disabled: !photo || (typeof photo.latitude !== 'number' || typeof photo.longitude !== 'number' || isNaN(photo.latitude) || isNaN(photo.longitude))
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}
