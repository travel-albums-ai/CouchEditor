import { Box } from '@mui/material';

import { TOOLBAR_GAP } from '@/layout';
import AppName from '@/middleware/tools/AppName';
import ExtendedMenu from '@/middleware/tools/ExtendedMenu';
import Logo from '@/middleware/tools/Logo';
import NewUploadToggle from '@/middleware/tools/NewUploadToggle';
import PipelineName from '@/middleware/tools/PipelineName';
import SaveCloneUploadToggle from '@/middleware/tools/SaveCloneUploadToggle';
import ShareFeedback from '@/middleware/tools/ShareFeedback';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';

export default function StartToolbar() {

  return (
    <Box
      sx={{ left: TOOLBAR_GAP, top: TOOLBAR_GAP, overflow: 'visible', position: 'absolute', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', maxWidth: '70%' }}
    >
      <FloatingToolbar>
        <ExtendedMenu />
        <Logo />
        <AppName />
        <ShareFeedback />
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
