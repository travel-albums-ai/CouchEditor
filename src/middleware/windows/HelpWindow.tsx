import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { paletteItems } from '@/middleware/windows/pipeline/NodePalette';
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
          },
        },
      }}
    >
      <div>Help Content</div>
      {paletteItems.map(paletteItem => (
        <div>
          sss
          <h3>{paletteItem.name}</h3>
          <p>{paletteItem.description}</p>
        </div>
      ))}
    </Dialog>
  )
}
