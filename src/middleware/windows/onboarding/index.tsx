import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import OnboardingTakeout from '@/middleware/windows/onboarding/OnboardingTakeout';
import OnboardingWelcome from '@/middleware/windows/onboarding/OnboardingWelcome';
import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';
import { ChevronLeft, ChevronsRight, CircleX } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Onboarding() {
  const { setSetting } = useSettings()
  const serverOnline = useSettingsStoreSelector((s) => s.serverOnline)

  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation();

  const steps = [
    "Welcome",
    'Let\'s Get Started',
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
        <Stepper activeStep={activeStep} alternativeLabel nonLinear={true} >
          {steps.map((label) => (
            <Step key={label}
              sx={{
                width: '110px'
              }}
            >
              <StepLabel >{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ height: '780px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {activeStep === 0 && <OnboardingWelcome />}
        {activeStep === 1 && <OnboardingTakeout />}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, gap: 1 }}>
        <Button
          disabled={activeStep === 0}
          startIcon={ <ChevronLeft size={16} /> }
          onClick={() => {
            if (activeStep > 0) {
              setActiveStep(prev => prev - 1)
            }
          } } variant="outlined">
          {t('onboardingPreviousStep')}
        </Button>
        <Button
          disabled={activeStep === 2 && !serverOnline}
          onClick={() => {
            if (activeStep < steps.length - 1) {
              setActiveStep(prev => prev + 1)
            }
            if (activeStep === steps.length - 1) {
              setSetting(prev => ({ ...prev, onboarding: false }))
              setSetting(prev => ({ ...prev, tutorial: true }))
            }
          }}
          startIcon={ activeStep === steps.length - 1 ? <CircleX size={16} /> : <ChevronsRight size={16} /> }
          variant="contained">
          {activeStep === steps.length - 1 ? 'Close onboarding' : t('onboardingNextStep')}
        </Button>
      </Box>
    </Box>
  </>)
}
