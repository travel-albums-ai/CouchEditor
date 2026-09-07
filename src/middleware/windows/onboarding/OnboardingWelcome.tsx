import OnboardingPhasesList from '@/middleware/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
import OnboardingWrapperInfo from '@/middleware/windows/onboarding/OnboardingWrapperInfo';
import { Typography } from '@mui/material';
import { Database, LayoutPanelLeft, SquareMousePointer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const phaseSteps = [
  {
    key: '1',
    icon: <SquareMousePointer />,
    titleKey: 'Download and Prepare ',
    descriptionKey: "Fetch your images, indexer and configure the folders to start indexing your photos.",
  },
  {
    key: '2',
    icon: <Database />,
    titleKey: "Index the photos",
    descriptionKey: "Let the indexer run and index your photos. This may take some time depending on the number of photos you have.",
  },
  {
    key: '3',
    icon: <LayoutPanelLeft />,
    titleKey: 'Hello memories! 🌍 🍕 🐈 🏔️ ⛵ 🥰 ',
    descriptionKey: 'Enjoy your travel albums! Remember your trips, your meals, your adventures and share them with your friends and family.',
  },
]

export default function OnboardingWelcome() {
  const { t } = useTranslation();

  return (<>
    <OnboardingWrapper>
      <img
        src="./logo_new_240.webp"
        alt="Logo"
        fetchPriority="high"
        width={240}
        height={186}
        style={{
          aspectRatio: '1/1',
          margin: 20
        }}
      />
      <Typography sx={{ p: 2, pt: 0, lineHeight: 2, textAlign: 'center', userSelect: 'none' }} variant="body1" color="textPrimary">
        {t('onboardingWelcomeBody')}
      </Typography>
    </OnboardingWrapper>
    <OnboardingWrapperInfo light={true}>
      <OnboardingPhasesList phaseSteps={phaseSteps} />
    </OnboardingWrapperInfo>
  </>)
}
