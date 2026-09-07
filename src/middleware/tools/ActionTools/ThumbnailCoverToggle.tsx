import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { LayoutDashboard, LayoutGrid } from 'lucide-react';

export default function ThumbnailCoverToggle() {
  const { setSetting } = useSettings()
  const thumbnailFormat = useSettingsStoreSelector((state) => state.thumbnailFormat)

  const handleThumbnailFormatChange = (newFormat: 'cover' | 'contain') => {
    setSetting((prev) => ({ ...prev, thumbnailFormat: newFormat }));
  }

  return <>
    <GenericToggleButtonGroup items={[
      {
        value: 'cover',
        webMcp: true,
        tooltip: 'Thumbnail Cover',
        onClick: () => handleThumbnailFormatChange('cover'),
        icon: <LayoutGrid size={20} />,
        selected: thumbnailFormat === 'cover'
      },
      {
        value: 'contain',
        webMcp: true,
        tooltip: 'Thumbnail Contain',
        onClick: () => handleThumbnailFormatChange('contain'),
        icon: <LayoutDashboard size={20} />,
        selected: thumbnailFormat === 'contain'
      }
    ] satisfies GenericToggleButtonProps[]} />
  </>;
}
