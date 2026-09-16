import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryHorizontalEnd } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TemplatesToggle() {
  const { setSetting } = useSettings()
  const templates = useSettingsStoreSelector((state) => state.showTemplates);
  const { t } = useTranslation()

  const handleTemplatesToggle = () => {
    setSetting((prev) => ({ ...prev, showTemplates: !prev.showTemplates }));
  }

  return <>
    <GenericToggleButtonGroup variant="standard" items={[
      {
        kbd: 'Alt+m',
        meta: {
          name: "Templates",
          description: "Open the templates panel.",
          icon: <GalleryHorizontalEnd />,
          group: t('toolsGroup')
        },
        tooltip: "Open the templates panel.",
        icon: <GalleryHorizontalEnd size={16} />,
        onClick: () => handleTemplatesToggle(),
        selected: templates,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>;
}
