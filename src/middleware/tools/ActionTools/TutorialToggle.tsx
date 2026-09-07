import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
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
    <WebMCPDataRun
      name="toggle_tutorial"
      description="Toggle the tutorial setting."
      execute={async () => {
        handleTutorialToggle();
        return 'Tutorial ' + (!tutorial ? 'enabled' : 'disabled') + '.';
      }}
    />

    <GenericToggleButtonGroup variant="standard" items={[
      {
        webMcp: true,
        tooltip: t('tutorialToggleTooltip'),
        icon: <CircleQuestionMark size={16} />,
        onClick: () => handleTutorialToggle(),
        selected: tutorial,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>;
}
