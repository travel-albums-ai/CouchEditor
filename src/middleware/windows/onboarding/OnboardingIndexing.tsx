import IndexerContent from '@/components/IndexerContent';
import { TwinLensMascot } from '@/mascot/TwinLensMascot';
import OnboardingPhasesList from '@/middleware/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
import OnboardingWrapperInfo from '@/middleware/windows/onboarding/OnboardingWrapperInfo';
import { Box, Tooltip } from '@mui/material';
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
        <IndexerContent />
      </Box>
    </OnboardingWrapper>

    <OnboardingWrapperInfo light={true}>
      <OnboardingPhasesList phaseSteps={phaseSteps} />

      <Box sx={{ width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tooltip arrow placement="bottom" title="Spot the mascot! It's SpotAI, the twin-lens mascot of Travel Albums. He loves to travel and take photos, just like you!">
          <TwinLensMascot />
        </Tooltip>
      </Box>


    </OnboardingWrapperInfo>
  </>)
}
