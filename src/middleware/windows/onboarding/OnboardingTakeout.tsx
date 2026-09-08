import OnboardingPhasesListHorizontal from '@/middleware/windows/onboarding/OnboardingPhasesListHorizontal';
import LayoutPopover from '@/middleware/windows/settings/LayoutPopover';
import { Box } from '@mui/material';
import { Astroid, Turtle } from 'lucide-react';

const phaseSteps = [
  {
    key: '1',
    icon: <Astroid />,
    titleKey: 'I probably speak your language',
    descriptionKey: 'Pick your preferred language.',
  },
  {
    key: '2',
    icon: <Turtle />,
    titleKey: "Theme Preference",
    descriptionKey: 'Choose between light and dark themes for the application interface.',
  },
]

export default function OnboardingTakeout() {

  return (<>
    <Box sx={{ display: 'flex', justifyContent: 'stretch', mb: 2, flexDirection: 'column', p: 2 }}>
      <LayoutPopover />
    </Box>
    <OnboardingPhasesListHorizontal phaseSteps={phaseSteps} />
  </>)
}
