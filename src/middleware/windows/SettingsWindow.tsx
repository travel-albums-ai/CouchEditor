import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingsContent from '@/middleware/windows/settings/SettingsContent';
import { Dialog } from '@mui/material';

export default function SettingsWindow() {
  const showSettings = useSettingsStoreSelector(s => s.showSettings)
  const { setSetting } = useSettings()

  const showWindow = showSettings === true

  if (!showWindow) return null

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={showWindow}
      onClose={() => setSetting(prev => ({ ...prev, showSettings: false }))}
      slotProps={{
        paper: {
          sx: {
            width: 1200,
            height: 850,
            maxWidth: 'none',
            maxHeight: 'none',
          },
        },
      }}
    >
      <SettingsContent />
    </Dialog>
  )
}
