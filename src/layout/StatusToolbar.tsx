import LoadingBar from '@/components/LoadingBar';
import StatusBar from '@/components/StatusBar';
import { TOOLBAR_GAP } from '@/layout';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import { Box } from '@mui/material';

export default function StatusToolbar() {

  return (
    <Box
      sx={{ bottom: TOOLBAR_GAP, left: '0%', right: '0%', overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center' }}
      id="pipeline-overlays"
    >
      <FloatingToolbar
        sx={{
          minWidth: '900px',
          maxWidth: '1200px'
        }}>
        <LoadingBar />
        <StatusBar />
      </FloatingToolbar>
    </Box>
  );
}
