import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { BookOpenText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function HelpToggle() {
  const { setSetting } = useSettings()
  const help = useSettingsStoreSelector((state) => state.showHelp);
  const { t } = useTranslation()

  const handleHelpToggle = () => {
    setSetting((prev) => ({ ...prev, showHelp: !prev.showHelp }));
  }

  return <>
    <GenericToggleButtonGroup variant="standard" items={[
      {
        kbd: 'Alt+m',
        meta: {
          name: "Manual",
          description: "Open the manual for guidance.",
          icon: <BookOpenText />,
          group: t('toolsGroup')
        },
        tooltip: "Open the manual for guidance.",
        tooltipPlacement: 'right',
        icon: <BookOpenText size={16} />,
        onClick: () => handleHelpToggle(),
        selected: help,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>;
}
