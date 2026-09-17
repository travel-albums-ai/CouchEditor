import DialogCloseButton from '@/components/DialogCloseButton';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import Templates from '@/windows/templates';
import { Dialog } from '@mui/material';

export default function TemplatesWindow() {
  const showTemplates = useSettingsStoreSelector(s => s.templatesOpen)
  const { setSetting } = useSettings()

  const showWindow = showTemplates === true

  if (!showWindow) return null

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={showWindow}
      onClose={() => setSetting(prev => ({ ...prev, templatesOpen: false }))}
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
        title="Close templates"
        onClick={() => setSetting(prev => ({ ...prev, templatesOpen: false }))}
      />
      <Templates />
    </Dialog>
  )
}
