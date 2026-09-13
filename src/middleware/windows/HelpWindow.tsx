import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import NodeToolboxHeader from '@/middleware/windows/pipeline/components/NodeToolboxHeader';
import PreviewDemo from '@/middleware/windows/pipeline/components/PreviewDemo';
import { paletteItems } from '@/middleware/windows/pipeline/NodePalette';
import { Alert, Box, Dialog } from '@mui/material';

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
      <Alert severity="info">
        Discover how to use the different nodes in the pipeline below.
      </Alert>

      <Box sx={{
        pt: 4,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 2,
      }}>
        {paletteItems.map(paletteItem => (<Box key={paletteItem.type} sx={{ display: 'flex', flexDirection: 'column' }}>
          <NodeToolboxHeader type={paletteItem.type}></NodeToolboxHeader>
          <Box sx={{
            boxShadow: theme => `inset 0 0 8px 0px ${theme.palette.divider}`,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // m: 1,
            py: 2 }}>
            <PreviewDemo paletteItem={paletteItem} />
            <NodeToolboxHeader type={paletteItem.type}></NodeToolboxHeader>
            {/* <h3>{paletteItem.name}</h3>
            <p>{paletteItem.description}</p> */}
          </Box>
        </Box>))}
      </Box>
    </Dialog>
  )
}
