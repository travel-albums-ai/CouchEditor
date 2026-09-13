import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import NodeToolboxHeader from '@/middleware/windows/pipeline/components/NodeToolboxHeader';
import PreviewDemo from '@/middleware/windows/pipeline/components/PreviewDemo';
import { groupedPaletteItems } from '@/middleware/windows/pipeline/NodePalette';
import { Alert, Box, Dialog, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function HelpWindow() {
  const showHelp = useSettingsStoreSelector(s => s.showHelp)
  const { setSetting } = useSettings()
  const { t } = useTranslation();
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

      {Object.entries(groupedPaletteItems).map(([groupName, group]) => (
        <Box key={groupName} sx={{ display: 'flex', flexDirection: 'column' }}>

          <Divider sx={{ my: 2, textTransform: 'capitalize', borderStyle: 'dotted' }}>
            <Typography color="textSecondary" variant="caption">{t(groupName)}</Typography>
          </Divider>

          <Box sx={{
            display: 'grid',
            alignSelf: 'stretch',

            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            mb: 4,
          }}>
            {group.map(paletteItem => (
              <Box key={paletteItem.type} sx={{ display: 'flex', flexDirection: 'column' }}>
                <NodeToolboxHeader type={paletteItem.type}></NodeToolboxHeader>
                <Box sx={{
                  boxShadow: theme => `inset 0 0 8px 0px ${theme.palette.divider}`,
                  borderRadius: 2,
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 2 }}>
                  <PreviewDemo paletteItem={paletteItem} />
                  {/* <NodeToolboxHeader type={paletteItem.type}></NodeToolboxHeader> */}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Dialog>
  )
}
