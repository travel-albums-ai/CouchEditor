import HelpToggle from '@/middleware/tools/HelpToggle';
import PointerReactflowToggle from '@/middleware/tools/PointerReactflowToggle';
import TemplatesToggle from '@/middleware/tools/TemplatesToggle';
import ToggleToolbox from '@/middleware/tools/ToggleToolbox';
import ViewerReactflowToggle from '@/middleware/tools/ViewerReactflowToggle';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import { TOOLBAR_GAP } from '@/middleware/windows/pipeline/components/PipelineCanvasOverlays';
import { Box, Divider } from '@mui/material';
import "@xyflow/react/dist/style.css";
import { Fragment } from 'react';
import './styles.css';

export default function ToolsBar({ children }: { children?: React.ReactNode }) {

  const menu = {
    'pointerToggle': {
      type: 'component',
      data: <PointerReactflowToggle />,
    },
    "handToggle": {
      type: 'component',
      data: <ViewerReactflowToggle />,
    },
    "divider1": {
      type: 'component',
      data: <Divider />
    },
    "helpToggle": {
      type: 'component',
      data: <HelpToggle />,
    },
    "divider2": {
      type: 'component',
      data: <Divider />
    },
    "templatesToggle": {
      type: 'component',
      data: <TemplatesToggle />,
    },
    "openToolbox": {
      type: 'component',
      data: <ToggleToolbox />
    },
    "divider3": {
      type: 'component',
      data: <Divider />
    },
  }

  return (
    <Box sx={{ bottom: 0, left: TOOLBAR_GAP, top: 0, overflow: 'visible', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <FloatingToolbar sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, position: 'relative' }}>
          {Object.entries(menu)
            .filter(([key, item]) => item.type !== 'divider' || item.visible !== false)
            .map(([key, item], index) => <Fragment key={key}>
              {item.type === 'component' && item?.data}
            </Fragment>
            )}
          {children}
        </Box>
      </FloatingToolbar>
    </Box>
  );
}
