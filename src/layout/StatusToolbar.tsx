import LoadingBar from '@/components/LoadingBar';
import StatusBar from '@/components/StatusBar';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import { TOOLBAR_GAP } from '@/middleware/windows/pipeline/components/PipelineCanvasOverlays';
import { Box } from '@mui/material';

export default function StatusToolbar() {

  return (
    <Box
      sx={{ bottom: TOOLBAR_GAP, left: '0%', right: '0%', overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center' }} id="pipeline-overlays"
    >
      <FloatingToolbar sx={{
        minWidth: '900px',
        maxWidth: '1200px'
      }}>
        <LoadingBar />
        <StatusBar />
      </FloatingToolbar>
    </Box>
  );
}
