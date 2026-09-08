import OnboardingPhasesListHorizontal from '@/middleware/windows/onboarding/OnboardingPhasesListHorizontal';
import BYOKPopover from '@/middleware/windows/settings/BYOKPopover';
import { Box } from '@mui/material';
import { Astroid, Turtle } from 'lucide-react';

const phaseSteps = [
  {
    key: '1',
    icon: <Astroid />,
    titleKey: 'onboardingAiTooling',
    descriptionKey: 'onboardingAiToolingDescription',
  },
  {
    key: '2',
    icon: <Turtle />,
    titleKey: 'onboardingSelectModel',
    descriptionKey: 'onboardingSelectModelDescription',
  },
]

export default function OnboardingAI() {

  return (<>
    <Box sx={{ display: 'flex', justifyContent: 'stretch', flexDirection: 'column', p: 2 }}>
      <BYOKPopover />
    </Box>
    <OnboardingPhasesListHorizontal phaseSteps={phaseSteps} />
  </>)
}
