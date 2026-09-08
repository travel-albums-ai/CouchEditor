import OnboardingPhasesListHorizontal from '@/middleware/windows/onboarding/OnboardingPhasesListHorizontal';
import BYOKPopover from '@/middleware/windows/settings/BYOKPopover';
import { Box } from '@mui/material';
import { Astroid, Turtle } from 'lucide-react';

const phaseSteps = [
  {
    key: '1',
    icon: <Astroid />,
    titleKey: 'AI Tooling',
    descriptionKey: 'Configure your AI tooling preferences.',
  },
  {
    key: '2',
    icon: <Turtle />,
    titleKey: "Select a model",
    descriptionKey: 'Choose the AI model that best fits your needs and price budget.',
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
