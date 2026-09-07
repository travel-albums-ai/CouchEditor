import OnboardingPhasesList from '@/middleware/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
import OnboardingWrapperInfo from '@/middleware/windows/onboarding/OnboardingWrapperInfo';
import { Typography } from '@mui/material';
import { GlobeOff, Save, Workflow } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const phaseSteps = [
  {
    key: '1',
    icon: <GlobeOff />,
    titleKey: 'Locally running',
    descriptionKey: "All your data is stored and processed locally on your machine. Except AI features which may require cloud processing.",
  },
  {
    key: '2',
    icon: <Workflow />,
    titleKey: "Drag and Drop",
    descriptionKey: "Build interactive workflows to process and manage photod efficiently.",
  },
  {
    key: '3',
    icon: <Save />,
    titleKey: 'Exchange with others pipelines',
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
          // aspectRatio: '1/1',
          margin: 20
        }}
      />
      <Typography sx={{ p: 2, pt: 0, lineHeight: 2, textAlign: 'center', userSelect: 'none' }} variant="body1" color="textPrimary">
        Welcome to Couch Editor! Your journey from the comfort of your couch to organizing and reliving your travel memories starts here at scale
      </Typography>
    </OnboardingWrapper>
    <OnboardingWrapperInfo light={true}>
      <OnboardingPhasesList phaseSteps={phaseSteps} />
    </OnboardingWrapperInfo>
  </>)
}
