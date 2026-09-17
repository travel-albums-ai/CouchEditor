import DarkLightStatus from '@/middleware/tools/DarkLightStatus';
import FullscreenToggle from '@/middleware/tools/FullscreenToggle';
import SettingsWindowToggle from '@/middleware/tools/SettingsWindowToggle';
import TutorialToggle from '@/middleware/tools/TutorialToggle';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import { TOOLBAR_GAP } from '@/middleware/windows/pipeline/components/PipelineCanvasOverlays';
import { Box } from '@mui/material';

export default function OthersToolbar() {

  return (
    <Box
      sx={{ top: TOOLBAR_GAP, right: TOOLBAR_GAP, overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center' }} id="pipeline-actions"
    >
      <FloatingToolbar sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0 }}>
        <SettingsWindowToggle />
        <DarkLightStatus />
        <FullscreenToggle />
        <TutorialToggle />
      </FloatingToolbar>
    </Box>
  );
}
