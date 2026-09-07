import { useSettingsStoreSelector } from '@/context/settingsStore';
import Onboarding from '@/middleware/windows/onboarding';
import { Dialog } from '@mui/material';

export default function OnboardingWindow() {
  const onboarding = useSettingsStoreSelector((state) => state.onboarding);

  const showWindow = onboarding === true

  if (!showWindow) return null

  return (
    <Dialog
      fullWidth
      open={onboarding}
      onClose={() => { }}
      slotProps={{
        paper: {
          sx: {
            userSelect: 'none',
            backgroundColor: 'transparent',
            width: 700,
            height: 980,
            maxWidth: 'none',
            maxHeight: 'none',
          },
        },
      }}
    >
      <Onboarding />
    </Dialog>
  )
}
