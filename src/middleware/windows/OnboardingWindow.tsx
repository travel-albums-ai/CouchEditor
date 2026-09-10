import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import Onboarding from '@/middleware/windows/onboarding';
import { Dialog } from '@mui/material';

export default function OnboardingWindow() {
  const onboarding = useSettingsStoreSelector((state) => state.onboarding);
  const { setSetting } = useSettings()
  const showWindow = onboarding === true

  if (!showWindow) return null

  return (
    <Dialog
      fullWidth
      open={onboarding}
      onClose={() => setSetting(prev => ({ ...prev, onboarding: false }))}
      slotProps={{
        paper: {
          sx: {
            userSelect: 'none',
            width: 700,
            height: 800,
            maxWidth: 'none',
            maxHeight: '90vh',
          },
        },
      }}
    >
      <Onboarding />
    </Dialog>
  )
}
