import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import NodeToolbox from '@/pipeline/NodeToolbox';
import { Box } from '@mui/material';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ToggleToolbox() {
  const { t } = useTranslation()

  return <>
    <GenericToggleButtonGroup id="toggle-toolbox-toggle"
      variant="standard"
      anchorHorizontal="right"
      anchorVertical="center"
      transformHorizontal="left"
      transformVertical="center"
      items={[
        {
          tooltip: t('toolboxOpen'),
          icon: <Plus />,
          noArrow: true,
          tooltipPlacement: 'right',
          nonModalPopover: true,
          popover: <Box sx={{ maxHeight: '80vh', overflow: 'auto' }} >
            <NodeToolbox />
          </Box>,
        }
      ] satisfies GenericToggleButtonProps[]} />
  </>
}
