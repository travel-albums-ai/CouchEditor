import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import OnboardingAI from '@/windows/onboarding/OnboardingAI';
import OnboardingSettings from '@/windows/onboarding/OnboardingSettings';
import OnboardingWelcome from '@/windows/onboarding/OnboardingWelcome';
import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';
import { ChevronLeft, ChevronsRight, CircleX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Onboarding() {
  const { setSetting } = useSettings()
  const serverOnline = useSettingsStoreSelector((s) => s.serverOnline)
  const onboardingStep = useSettingsStoreSelector((s) => s.onboardingStep)
  const { t } = useTranslation();

  const steps = [
    t('onboardingWelcomeStep'),
    t('onboardingThemesStep'),
    t('onboardingAiToolsStep'),
  ];

  return (<>
    <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2 }}>


      <Box sx={{ height: '675px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', pb: 2 }}>
        {onboardingStep === 0 && <OnboardingWelcome />}
        {onboardingStep === 1 && <OnboardingSettings />}
        {onboardingStep === 2 && <OnboardingAI />}
      </Box>

      <Box sx={{
        px: 1,
        pr: 3,
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: 1,
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

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'stretch' }}>
          <Button
            id="onboarding-back-button"
            sx={{ borderRadius: 4 }}
            disabled={onboardingStep === 0}
            onClick={() => {
              if (onboardingStep > 0) {
                setSetting(prev => ({ ...prev, onboardingStep: prev.onboardingStep - 1 }))
              }
            } } variant="outlined">
            <ChevronLeft size={16} />
          </Button>
          <Button
            id="onboarding-next-button"
            sx={{ borderRadius: 4 }}
            onClick={() => {
              if (onboardingStep < steps.length - 1) {
                setSetting(prev => ({ ...prev, onboardingStep: prev.onboardingStep + 1 }))
              }
              if (onboardingStep === steps.length - 1) {
                setSetting(prev => ({ ...prev, onboarding: false }))
                setSetting(prev => ({ ...prev, tutorial: true }))
              }
            }}
            variant="contained">
            { onboardingStep === steps.length - 1 ? <CircleX size={16} /> : <ChevronsRight size={16} /> }
          </Button>
        </Box>
      </Box>
    </Box>
  </>)
}
