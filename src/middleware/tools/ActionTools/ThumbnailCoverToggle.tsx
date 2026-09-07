import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { LayoutDashboard, LayoutGrid } from 'lucide-react';

export default function ThumbnailCoverToggle() {
  const { setSetting } = useSettings()
  const thumbnailFormat = useSettingsStoreSelector((state) => state.thumbnailFormat)

  const handleThumbnailFormatChange = (newFormat: 'cover' | 'contain') => {
    setSetting((prev) => ({ ...prev, thumbnailFormat: newFormat }));
  }

  return <>
    <WebMCPDataRun
      name="toggle_thumbnail_format"
      description="Toggle the thumbnail format of photos."
      inputSchema={{
        type: 'object',
        properties: {
          thumbnailFormat: {
            type: 'string',
            enum: ['cover', 'contain'],
            description: 'The thumbnail format of photos.',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ thumbnailFormat }: { thumbnailFormat: 'cover' | 'contain' }) => {
        handleThumbnailFormatChange(thumbnailFormat);
        return 'thumbnailFormat: ' + (thumbnailFormat ?? 'cover') + '.';
      }}
    />

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
