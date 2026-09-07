import IndexerSettings from '@/components/IndexerSettings';
import OnboardingPhasesList from '@/middleware/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
import OnboardingWrapperInfo from '@/middleware/windows/onboarding/OnboardingWrapperInfo';
import { Box } from '@mui/material';
import { Code, RefreshCw } from 'lucide-react';

const phaseSteps = [
  {
    key: '1',
    icon: <Code />,
    titleKey: "Configure the source and cache folder",
    descriptionKey: 'Configure the source folder where your Google Takeout photos are located and the cache folder where the indexer will store its data.',
  },
  {
    key: '2',
    icon: <RefreshCw />,
    titleKey: "Let it run",
    descriptionKey: 'Wait for the indexer to finish indexing your photos. This may take some time depending on the number of photos you have.',
  },
]

export default function OnboardingFolders() {

  return (<>
    <OnboardingWrapper>
      <Box sx={{ flex: 0, width: '100%', p: 1 }}>
        <IndexerSettings asIs />
      </Box>
    </OnboardingWrapper>
    <OnboardingWrapperInfo light={true}>
      <OnboardingPhasesList phaseSteps={phaseSteps} />
    </OnboardingWrapperInfo>
  </>)
}
