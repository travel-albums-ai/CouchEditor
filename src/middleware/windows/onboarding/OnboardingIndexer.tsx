import ServerStatus from '@/middleware/base/ServerStatus';
import OnboardingPhasesList from '@/middleware/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
import OnboardingWrapperInfo from '@/middleware/windows/onboarding/OnboardingWrapperInfo';
import { PlatformDownloadButton } from '@/middleware/windows/onboarding/PlatformDownload';
import { Box, Button, Typography } from '@mui/material';
import { ExternalLink, PackageOpen, Play, SquareMousePointer } from 'lucide-react';

const phaseSteps = [
  {
    key: '1',
    icon: <SquareMousePointer />,
    titleKey: "Download the Indexer",
    descriptionKey: 'Go to https://github.com/travel-albums-ai/albums-google-photos-indexer/releases and download the latest version of the Indexer for your operating system.',
    children: <a href="https://github.com/travel-albums-ai/albums-google-photos-indexer/releases" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <Button variant="outlined" color="primary">
        <ExternalLink size={16} style={{ marginRight: 8 }} />
        More...
      </Button>
    </a>
  },
  {
    key: '2',
    icon: <PackageOpen />,
    titleKey: "Unpack the Indexer",
    descriptionKey: 'After downloading, unpack the Indexer to a location of your choice.',
  },
  {
    key: '3',
    icon: <Play />,
    titleKey: "Run the Indexer",
    descriptionKey: 'After unpacking, run the Indexer to start indexing your photos.',
  },
]

export default function OnboardingIndexer() {

  return (<>
    <OnboardingWrapper>
      <img src="/image.1.png" alt="Releases" style={{ width: '100%', borderRadius: 8, height: '312px' }} />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', width: '100%', justifyContent: 'space-between' }} >
        <PlatformDownloadButton />

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mr: 1 }}>
          <ServerStatus />
          <Typography variant="caption" color="textSecondary">Server status</Typography>
        </Box>
      </Box>
    </OnboardingWrapper>

    <OnboardingWrapperInfo light={true}>
      <OnboardingPhasesList phaseSteps={phaseSteps} />
    </OnboardingWrapperInfo>
  </>)
}
