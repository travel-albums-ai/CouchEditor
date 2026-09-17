import PreviewDemo from '@/windows/pipeline/components/PreviewDemo';
import { PreviewDescription } from '@/windows/pipeline/components/PreviewDescription';
import PreviewTitle from '@/windows/pipeline/components/PreviewTitle';
import { Box } from '@mui/material';

export default function HelpItem({ paletteItem }: { paletteItem: any }) {

  return (
    <>
      <Box key={paletteItem.type} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2,
          px: 2,
          bgcolor: theme => theme.palette.background.paper,
          boxShadow: theme => `0 0 16px -3px ${theme.palette.divider}`,
        }}>
          <Box sx={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PreviewDemo paletteItem={paletteItem} />
          </Box>
          <PreviewTitle paletteItem={paletteItem} />
          <PreviewDescription paletteItem={paletteItem} textAlign="center" />
        </Box>
      </Box>
    </>
  )
}
