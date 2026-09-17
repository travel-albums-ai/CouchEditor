import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { CircleQuestionMark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TutorialToggle() {
  const { setSetting } = useSettings()
  const tutorial = useSettingsStoreSelector((state) => state.tutorial);
  const { t } = useTranslation()

  const handleTutorialToggle = () => {
    setSetting((prev) => ({ ...prev, tutorial: !prev.tutorial }));
  }

  return <>
    <GenericToggleButtonGroup variant="standard" items={[
      {
        kbd: 'Alt+h',
        meta: {
          name: t('tutorialName'),
          description: t('tutorialDescription'),
          icon: <CircleQuestionMark />,
          group: t('toolsGroup')
        },
        tooltip: t('tutorialToggleTooltip'),
        icon: <CircleQuestionMark size={16} />,
        onClick: () => handleTutorialToggle(),
        selected: tutorial,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>;
}
