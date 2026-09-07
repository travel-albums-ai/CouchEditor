import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import ReactFlowWrapper from '@/middleware/windows/pipeline/ReactFlowWrapper';
import { Dialog } from '@mui/material';

export default function PipelineWindow() {
  const pipelineOpen = useSettingsStoreSelector(s => s.pipelineOpen)
  const performanceMode = useSettingsStoreSelector(s => s.performanceMode)
  const { setSetting } = useSettings()

  const showWindow = pipelineOpen

  if (!showWindow) return null

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={showWindow}
      onClose={() => setSetting(prev => ({ ...prev, pipelineOpen: false }))}
      slotProps={{
        paper: {
          sx: {
            ...performanceMode && {
              bgcolor: 'background.paper',
            },
            width: '95vw',
            height: '95vh',
            maxHeight: '95vh',
            maxWidth: '95vw',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <ReactFlowWrapper />
    </Dialog>
  )
}
