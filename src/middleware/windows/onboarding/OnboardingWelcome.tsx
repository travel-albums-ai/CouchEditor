import OnboardingPhasesListHorizontal from '@/middleware/windows/onboarding/OnboardingPhasesListHorizontal';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
import { Box, Typography } from '@mui/material';
import { Astroid, GlobeOff, Save, Workflow } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const phaseSteps = [
  {
    key: '1',
    icon: <GlobeOff />,
    titleKey: 'Locally running',
    descriptionKey: "Your computer is the server. Nothing is uploaded",
  },
  {
    key: '4',
    icon: <Astroid />,
    titleKey: 'AI features',
    descriptionKey: "Math only goes so far. AI features require cloud processing.",
  },
  {
    key: '2',
    icon: <Workflow />,
    titleKey: "Drag and Drop",
    descriptionKey: "Build interactive workflows to process photos efficiently.",
  },
  {
    key: '3',
    icon: <Save />,
    titleKey: 'Shareable pipelines',
    descriptionKey: 'Build and share reusable pipelines with others.',
  },
]

export default function OnboardingWelcome() {
  const { t } = useTranslation();

  return (<>
    <OnboardingWrapper>
      <img
        src="./couchLogo.png"
        alt="Logo"
        fetchPriority="high"
        width={340}
        style={{
          margin: 20
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ textAlign: 'center', userSelect: 'none', textShadow: '1px 1px 0px rgba(0,0,0,0.1)', fontFamily: 'cursive' }} variant="h6" color="textPrimary">
        Couch Editor
        </Typography>
        <Typography sx={{ textAlign: 'center', userSelect: 'none', textShadow: '1px 1px 0px rgba(0,0,0,0.1)', fontFamily: 'cursive' }} variant="body1" color="textPrimary">
        Photo processing made easy and efficient.
        </Typography>
      </Box>
    </OnboardingWrapper>

    <OnboardingPhasesListHorizontal phaseSteps={phaseSteps} />

  </>)
}
