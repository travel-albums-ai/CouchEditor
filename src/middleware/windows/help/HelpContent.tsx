import NodeToolboxHeader from '@/middleware/windows/pipeline/components/NodeToolboxHeader';
import PreviewDemo from '@/middleware/windows/pipeline/components/PreviewDemo';
import { groupedPaletteItems } from '@/middleware/windows/pipeline/NodePalette';
import { Alert, Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function HelpContent() {
  const { t } = useTranslation();


  return (
    <>
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
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </>
  )
}
