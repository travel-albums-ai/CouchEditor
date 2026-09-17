import OnboardingPhasesListHorizontal from '@/windows/onboarding/OnboardingPhasesListHorizontal';
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
    <Box sx={{
      position: 'relative',
      backgroundImage: `url(./welcome.png)`,
      backgroundSize: '400px',
      backgroundPosition: 'right',
      backgroundRepeat: 'no-repeat',
    }}>
      <Box sx={{ py: 6, pl: 4, display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'flex-start'}}>
        <Box sx={{ borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Typography color="textSecondary" variant="subtitle2" sx={{ pb: 2 }}>WELCOME TO</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
            <Typography color="textPrimary" variant="h3" sx={{ }}>Couch</Typography>
            <Typography color="primary" variant="h3" sx={{ fontWeight: 'bold' }}>Editor</Typography>
          </Box>
          <Typography color="textSecondary" variant="h6" sx={{ whiteSpace: 'wrap', width: '300px', display: 'block' }}>{t('couchEditorTagline')}</Typography>
          <Typography color="textDisabled" variant="caption" sx={{ whiteSpace: 'wrap', width: '300px', mt: 2, display: 'block' }}>A powerfull, offline-first photo editor that runs locally on your computer. No uploads, no limits. Just creativity</Typography>
        </Box>
      </Box>
    </Box>

    <OnboardingPhasesListHorizontal phaseSteps={phaseSteps} />
  </>)
}
