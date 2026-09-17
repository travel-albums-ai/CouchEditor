import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import HelpToggle from '@/middleware/tools/ActionTools/HelpToggle';
import TemplatesToggle from '@/middleware/tools/ActionTools/TemplatesToggle';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import { TOOLBAR_GAP } from '@/middleware/windows/pipeline/components/PipelineCanvasOverlays';
import { Box, Divider } from '@mui/material';
import "@xyflow/react/dist/style.css";
import { Hand, MousePointer2, Plus } from 'lucide-react';
import { Fragment } from 'react';
import NodeToolbox from "./NodeToolbox";
import './styles.css';

export default function ToolsBar({ children }: { children?: React.ReactNode }) {
  const lockReactflow = usePipelineStoreSelector(state => state.lockReactflow);
  const {
    enableReactflow,
    disableReactflow,
  } = usePipelineStore();

  const menu = {
    'pointer': {
      type: 'toggle',
      data: {
        tooltip: 'Interactive mode',
        icon: <MousePointer2 />,
        onClick: () => {
          enableReactflow();
        },
        selected: !lockReactflow,
      }
    },
    "hand": {
      type: 'toggle',
      data: {
        tooltip: 'Viewer mode',
        icon: <Hand />,
        onClick: () => {
          disableReactflow();
        },
        selected: lockReactflow,
      }
    },
    "divider1": {
      type: 'divider',
    },
    "helpToggle": {
      type: 'component',
      data: <HelpToggle />,
    },
    "divider2": {
      type: 'divider',
    },
    "templatesToggle": {
      type: 'component',
      data: <TemplatesToggle />,
    },
    "openToolbox": {
      type: 'toggle',
      data: {
        tooltip: 'Open toolbox',
        icon: <Plus />,
        noArrow: true,
        popover: <Box sx={{ maxHeight: '80vh', overflow: 'auto' }} >
          <NodeToolbox />
        </Box>,
      }
    },
    "divider3": {
      visible: children != null,
      type: 'divider',
    },
  }

  return (
    <>
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
                {item.type === 'toggle' && <GenericToggleButtonGroup
                  key={index}
                  id={`menu-toggle-${index}`}
                  variant="standard"
                  anchorHorizontal="right"
                  anchorVertical="center"
                  transformHorizontal="left"
                  transformVertical="center"
                  items={[
                    {
                      ...item?.data,
                      tooltipPlacement: 'right',
                    }] satisfies GenericToggleButtonProps[]
                  }
                />}
                {item.type === 'divider' && <Divider />}
                {item.type === 'component' && item?.data}
              </Fragment>
              )}
            {children}
          </Box>
        </FloatingToolbar>
      </Box>
    </>
  );
}
