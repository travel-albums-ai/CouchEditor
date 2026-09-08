import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import OnboardingAI from '@/middleware/windows/onboarding/OnboardingAI';
import OnboardingTakeout from '@/middleware/windows/onboarding/OnboardingTakeout';
import OnboardingWelcome from '@/middleware/windows/onboarding/OnboardingWelcome';
import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';
import { ChevronLeft, ChevronsRight, CircleX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Onboarding() {
  const { setSetting } = useSettings()
  const serverOnline = useSettingsStoreSelector((s) => s.serverOnline)
  const onboardingStep = useSettingsStoreSelector((s) => s.onboardingStep)

  // const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation();

  const steps = [
    "Welcome",
    "Themes & Locales",
    "AI Tools",
  ];


  return (<>
    <Box sx={{
    }}>
      <Box sx={{
        p: 2,
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Stepper activeStep={onboardingStep} alternativeLabel nonLinear={true} >
          {steps.map((label) => (
            <Step key={label}
              sx={{
                width: '140px'
              }}
            >
              <StepLabel >{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ height: '675px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {onboardingStep === 0 && <OnboardingWelcome />}
        {onboardingStep === 1 && <OnboardingTakeout />}
        {onboardingStep === 2 && <OnboardingAI />}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, gap: 1, borderTop: '1px solid', borderColor: 'divider', pt: 5 }}>
        <Button
          disabled={onboardingStep === 0}
          startIcon={ <ChevronLeft size={16} /> }
          onClick={() => {
            if (onboardingStep > 0) {
              setSetting(prev => ({ ...prev, onboardingStep: prev.onboardingStep - 1 }))
            }
          } } variant="outlined">
          {t('onboardingPreviousStep')}
        </Button>
        <Button
          disabled={onboardingStep === 2 && !serverOnline}
          onClick={() => {
            if (onboardingStep < steps.length - 1) {
              setSetting(prev => ({ ...prev, onboardingStep: prev.onboardingStep + 1 }))
            }
            if (onboardingStep === steps.length - 1) {
              setSetting(prev => ({ ...prev, onboarding: false }))
              setSetting(prev => ({ ...prev, tutorial: true }))
            }
          }}
          startIcon={ onboardingStep === steps.length - 1 ? <CircleX size={16} /> : <ChevronsRight size={16} /> }
          variant="contained">
          {onboardingStep === steps.length - 1 ? '👋' : t('onboardingNextStep')}
        </Button>
      </Box>
    </Box>
  </>)
}
