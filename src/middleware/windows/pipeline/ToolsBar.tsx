import { Box } from '@mui/material';
import "@xyflow/react/dist/style.css";
import './styles.css';


import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import SettingsWindowToggle from '@/middleware/tools/ActionTools/SettingsWindowToggle';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import { Plus } from 'lucide-react';
import NodeToolbox from "./NodeToolbox";

export default function ToolsBar() {


  return (
    <Box className="app" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>





      <Box sx={{ bottom: 0, left: 16, top: 0, overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FloatingToolbar sx={{
          display: 'flex',
          flexDirection: 'column',
          // height: '200px',
          // minWidth: '900px',
          // maxWidth: '1200px'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* <PopoverButtonSimple trigger={<span><EllipsisVertical /></span>}>
              <NodeToolbox />
            </PopoverButtonSimple>
            <PopoverButton
              anchorHorizontal="right"
              width={600}
              anchorVertical="top"
              transformHorizontal="left"
              transformVertical="bottom"
              trigger={<span><EllipsisVertical /></span>}>
              <NodeToolbox />
            </PopoverButton> */}
            <GenericToggleButtonGroup
              id="extended-menu-toggle"
              variant="standard"
              anchorHorizontal="right"
              anchorVertical="top"
              transformHorizontal="left"
              transformVertical="bottom"
              items={[
                {
                  tooltip: 'Open toolbox',
                  icon: <Plus />,
                  noArrow: true,
                  popover: <>
                    <NodeToolbox />
                  </>,
                },
              ] satisfies GenericToggleButtonProps[]}
            />
            <SettingsWindowToggle />
          </Box>
        </FloatingToolbar>
      </Box>

      {/*
        <FloatingStack
          sx={{ top: 10, left: 12, bottom: showToolbox ? 10 : 'auto', overflow: 'auto' }}
          id="pipeline-toolbox"
          key={`pipeline-toolbox-${showToolbox ? 'visible' : 'hidden'}`}
          asIs={!showToolbox}>

          <GenericToggleButtonGroup
            id="extended-menu-toggle"
            variant="standard"
            items={[
              {
                tooltip: '',
                icon: <EllipsisVertical />,
                popover: <>
                  <NodeToolbox />
                </>,
              },
            ] satisfies GenericToggleButtonProps[]}
          />

          {showToolbox
            ? <NodeToolbox />
            : <ToggleToolbox />}
        </FloatingStack> */}
    </Box>
  );
}
