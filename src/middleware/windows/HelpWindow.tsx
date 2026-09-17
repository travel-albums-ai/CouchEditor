import DialogCloseButton from '@/components/DialogCloseButton';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import HelpContent from '@/middleware/windows/help/HelpContent';
import { Dialog } from '@mui/material';

export default function HelpWindow() {
  const showHelp = useSettingsStoreSelector(s => s.showHelp)
  const { setSetting } = useSettings()
  const showWindow = showHelp === true

  if (!showWindow) return null

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={showWindow}
      onClose={() => setSetting(prev => ({ ...prev, showHelp: false }))}
      slotProps={{
        paper: {
          sx: {
            width: 1200,
            height: 850,
            maxWidth: 'none',
            maxHeight: 'none',
            position: 'relative',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          },
        },
      }}
    >
      <DialogCloseButton
        title="Close help"
        onClick={() => setSetting(prev => ({ ...prev, showHelp: false }))}
      />
      <HelpContent />
    </Dialog>
  )
}
