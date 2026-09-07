import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { DoorOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function OnboardingToggle() {
  const { setSetting } = useSettings()
  const onboarding = useSettingsStoreSelector((state) => state.onboarding);
  const { t } = useTranslation()

  return <GenericToggleButtonGroup variant="standard" items={[
    {
      tooltip: t('toggleOnboarding'),
      icon: <DoorOpen />,
      onClick: () => setSetting((prev) => ({ ...prev, onboarding: !onboarding })) ,
      selected: onboarding,
    },
  ] as GenericToggleButtonProps[]} />
}
