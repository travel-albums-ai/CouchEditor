import { Box, Divider } from '@mui/material';
import "@xyflow/react/dist/style.css";
import './styles.css';


import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import HelpToggle from '@/middleware/tools/ActionTools/HelpToggle';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import { GitFork, Hand, HardDrive, Heart, ImageUpscale, MousePointer2, Plus } from 'lucide-react';
import NodeToolbox from "./NodeToolbox";


const pipelineIcons = {

  "pipelineGroupInput": <HardDrive />,
  "pipelineLogicInput": <GitFork />,
  "pipelineGroupTransform": <ImageUpscale />,
  "pipelineGroupLight": <Plus />,
  "pipelineGroupColor": <Plus />,
  "pipelineGroupDetail": <Plus />,
  "pipelineGroupEffects": <Plus />,
  'pipelineGroupAi': <Heart />,
  "pipelineGroupOutput": <Plus />,
}

export default function ToolsBar() {
  const lockReactflow = usePipelineStoreSelector(state => state.lockReactflow);
  const {
    enableReactflow,
    disableReactflow,
  } = usePipelineStore();
  return (
    <Box className="app" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>





      <Box sx={{ bottom: 0, left: 16, top: 0, overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FloatingToolbar sx={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, position: 'relative' }}>
            <GenericToggleButtonGroup
              id="extended-menu-toggle"
              variant="standard"
              anchorHorizontal="right"
              anchorVertical="center"
              transformHorizontal="left"
              transformVertical="center"
              items={[
                {
                  tooltip: 'Open toolbox',
                  icon: <MousePointer2 />,
                  onClick: () => {
                    enableReactflow();
                  },
                  selected: !lockReactflow,
                },
              ] satisfies GenericToggleButtonProps[]}
            />
            <GenericToggleButtonGroup
              id="extended-menu-toggle"
              variant="standard"
              anchorHorizontal="right"
              anchorVertical="center"
              transformHorizontal="left"
              transformVertical="center"
              items={[
                {
                  tooltip: 'Open toolbox',
                  icon: <Hand />,
                  onClick: () => {
                    disableReactflow();
                  },
                  selected: lockReactflow,
                },
              ] satisfies GenericToggleButtonProps[]}
            />

            <Divider />

            <HelpToggle />
            <GenericToggleButtonGroup
              id="extended-menu-toggle"
              variant="standard"
              anchorHorizontal="right"
              anchorVertical="center"
              transformHorizontal="left"
              transformVertical="center"
              items={[
                {
                  tooltip: 'Open toolbox',
                  icon: <Plus />,
                  noArrow: true,
                  popover: <Box sx={{ maxHeight: '80vh', overflow: 'auto' }} >
                    <NodeToolbox />
                  </Box>,
                },
              ] satisfies GenericToggleButtonProps[]}
            />
          </Box>
        </FloatingToolbar>
      </Box>
    </Box>
  );
}
