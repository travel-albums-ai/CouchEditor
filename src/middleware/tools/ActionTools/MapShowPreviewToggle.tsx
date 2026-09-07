import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryThumbnails } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MapShowPreviewToggle() {
  const { setSetting } = useSettings()
  const mapShowPreview = useSettingsStoreSelector((state) => state.mapShowPreview);
  const { t } = useTranslation()

  return <GenericToggleButtonGroup variant="standard" items={[
    {
      tooltip: t('toggleMapPreview'),
      icon: <GalleryThumbnails />,
      onClick: () => setSetting((prev) => ({ ...prev, mapShowPreview: !prev.mapShowPreview })) ,
      selected: mapShowPreview,
    },
  ] as GenericToggleButtonProps[]} />
}
