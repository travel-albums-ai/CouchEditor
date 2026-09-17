import HelpToggle from '@/middleware/tools/HelpToggle';
import PointerReactflowToggle from '@/middleware/tools/PointerReactflowToggle';
import TemplatesToggle from '@/middleware/tools/TemplatesToggle';
import ToggleToolbox from '@/middleware/tools/ToggleToolbox';
import ViewerReactflowToggle from '@/middleware/tools/ViewerReactflowToggle';
import DeleteButton from '@/middleware/windows/pipeline/components/DeleteButton';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import { TOOLBAR_GAP } from '@/middleware/windows/pipeline/components/PipelineCanvasOverlays';
import { Box, Divider } from '@mui/material';

export default function ToolboxToolbar() {

  return (
    <Box sx={{ bottom: 0, left: TOOLBAR_GAP, top: 0, overflow: 'visible', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <FloatingToolbar sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, position: 'relative' }}>

          <PointerReactflowToggle />
          <ViewerReactflowToggle />
          <Divider />
          <HelpToggle />
          <Divider />
          <TemplatesToggle />
          <ToggleToolbox />
          <Divider />
          <DeleteButton />

        </Box>
      </FloatingToolbar>
    </Box>
  );
}
