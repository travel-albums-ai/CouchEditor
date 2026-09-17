import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import PipelineTemplates from '@/middleware/windows/pipeline/components/PipelineTemplates';
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
          },
        },
      }}
    >
      <PipelineTemplates />
    </Dialog>
  )
}
