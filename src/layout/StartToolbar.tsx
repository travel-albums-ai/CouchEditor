import { Box } from '@mui/material';

import { TOOLBAR_GAP } from '@/layout';
import StartPart from '@/layout/StartPart';
import NewUploadToggle from '@/middleware/tools/NewUploadToggle';
import PipelineName from '@/middleware/tools/PipelineName';
import SaveCloneUploadToggle from '@/middleware/tools/SaveCloneUploadToggle';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';

export default function StartToolbar() {

  return (
    <Box
      sx={{ left: TOOLBAR_GAP, top: TOOLBAR_GAP, overflow: 'visible', position: 'absolute', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', maxWidth: '70%' }}
    >
      <FloatingToolbar>
        <StartPart />
      </FloatingToolbar>

      <FloatingToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NewUploadToggle />
          <PipelineName />
          <SaveCloneUploadToggle />
        </Box>
      </FloatingToolbar>
    </Box>
  );
}
