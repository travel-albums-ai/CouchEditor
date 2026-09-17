import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import NodeToolbox from '@/middleware/windows/pipeline/NodeToolbox';
import { Box } from '@mui/material';
import { Plus } from 'lucide-react';

export default function ToggleToolbox() {

  return <>
    <GenericToggleButtonGroup id="toggle-toolbox-toggle"
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
          tooltipPlacement: 'right',
          popover: <Box sx={{ maxHeight: '80vh', overflow: 'auto' }} >
            <NodeToolbox />
          </Box>,
        }
      ] satisfies GenericToggleButtonProps[]} />
  </>
}
