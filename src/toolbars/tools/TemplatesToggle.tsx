import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryHorizontalEnd } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TemplatesToggle() {
  const { setSetting } = useSettings()
  const showTemplates = useSettingsStoreSelector((state) => state.templatesOpen);
  const { t } = useTranslation()

  const handleOnChange = () => setSetting((prev) => ({ ...prev, templatesOpen: !prev.templatesOpen}));

  return <>
    <GenericToggleButtonGroup variant="standard" id="templates-toggle" items={[
      {
        kbd: 'Alt+s',
        tooltip: t('templatesToggle'),
        tooltipPlacement: 'right',
        icon: <GalleryHorizontalEnd />,
        onClick: () => handleOnChange(),
        selected: showTemplates,
      },
    ] as GenericToggleButtonProps[]} />
  </>
}
