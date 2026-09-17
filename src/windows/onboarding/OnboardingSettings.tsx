import OnboardingPhasesListHorizontal from '@/windows/onboarding/OnboardingPhasesListHorizontal';
import LayoutPopover from '@/windows/settings/LayoutPopover';
import { Box } from '@mui/material';
import { Languages, PaintBucket } from 'lucide-react';

const phaseSteps = [
  {
    key: '1',
    icon: <Languages />,
    titleKey: 'onboardingLanguage',
    descriptionKey: 'onboardingLanguageDescription',
  },
  {
    key: '2',
    icon: <PaintBucket />,
    titleKey: 'onboardingThemePreference',
    descriptionKey: 'onboardingThemePreferenceDescription',
  },
]

export default function OnboardingSettings() {

  return (<>
    <Box sx={{ display: 'flex', justifyContent: 'stretch', flexDirection: 'column', p: 1.5 }}>
      <LayoutPopover />
    </Box>
    <OnboardingPhasesListHorizontal phaseSteps={phaseSteps} />
  </>)
}
