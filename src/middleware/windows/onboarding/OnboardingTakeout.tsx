import OnboardingPhasesListHorizontal from '@/middleware/windows/onboarding/OnboardingPhasesListHorizontal';
import LayoutPopover from '@/middleware/windows/settings/LayoutPopover';
import { Box } from '@mui/material';
import { Astroid, Turtle } from 'lucide-react';

const phaseSteps = [
  {
    key: '1',
    icon: <Astroid />,
    titleKey: 'onboardingLanguage',
    descriptionKey: 'onboardingLanguageDescription',
  },
  {
    key: '2',
    icon: <Turtle />,
    titleKey: 'onboardingThemePreference',
    descriptionKey: 'onboardingThemePreferenceDescription',
  },
]

export default function OnboardingTakeout() {

  return (<>
    <Box sx={{ display: 'flex', justifyContent: 'stretch', flexDirection: 'column', p: 2 }}>
      <LayoutPopover />
    </Box>
    <OnboardingPhasesListHorizontal phaseSteps={phaseSteps} />
  </>)
}
