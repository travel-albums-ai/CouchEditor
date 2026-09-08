import OnboardingPhasesListHorizontal from '@/middleware/windows/onboarding/OnboardingPhasesListHorizontal';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
import { Box, Typography } from '@mui/material';
import { Astroid, GlobeOff, Save, Workflow } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const phaseSteps = [
  {
    key: '1',
    icon: <GlobeOff />,
    titleKey: 'onboardingLocallyRunning',
    descriptionKey: 'onboardingLocallyRunningDescription',
  },
  {
    key: '4',
    icon: <Astroid />,
    titleKey: 'onboardingAiFeatures',
    descriptionKey: 'onboardingAiFeaturesDescription',
  },
  {
    key: '2',
    icon: <Workflow />,
    titleKey: 'onboardingDragAndDrop',
    descriptionKey: 'onboardingDragAndDropDescription',
  },
  {
    key: '3',
    icon: <Save />,
    titleKey: 'onboardingShareablePipelines',
    descriptionKey: 'onboardingShareablePipelinesDescription',
  },
]

export default function OnboardingWelcome() {
  const { t } = useTranslation();

  return (<>
    <OnboardingWrapper>
      <img
        src="./couchLogo.png"
        alt={t('logoAlt')}
        fetchPriority="high"
        width={340}
        style={{
          margin: 20
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography sx={{ textAlign: 'center', userSelect: 'none', textShadow: '1px 1px 0px rgba(0,0,0,0.1)', fontFamily: 'cursive' }} variant="h6" color="textPrimary">
          {t('couchEditor')}
        </Typography>
        <Typography sx={{ textAlign: 'center', userSelect: 'none', textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }} variant="body1" color="textPrimary">
          {t('couchEditorTagline')}
        </Typography>
      </Box>
    </OnboardingWrapper>

    <OnboardingPhasesListHorizontal phaseSteps={phaseSteps} />

  </>)
}
