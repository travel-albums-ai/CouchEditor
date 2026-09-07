import OnboardingPhasesList from '@/middleware/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
import OnboardingWrapperInfo from '@/middleware/windows/onboarding/OnboardingWrapperInfo';
import { Box } from '@mui/material';
import { Coffee } from 'lucide-react';

const phaseSteps = [
  {
    key: '1',
    icon: <Coffee />,
    titleKey: "Time for a coffee break",
    descriptionKey: 'While the indexer is running, you can take a break and enjoy a cup of coffee. The indexing process may take some time depending on the number of photos you have.',
  },
]

export default function OnboardingIndexing() {

  return (<>
    <OnboardingWrapper>
      <Box sx={{ flex: 0, width: '100%', p: 1 }}>
      </Box>
    </OnboardingWrapper>

    <OnboardingWrapperInfo light={true}>
      <OnboardingPhasesList phaseSteps={phaseSteps} />

    </OnboardingWrapperInfo>
  </>)
}
