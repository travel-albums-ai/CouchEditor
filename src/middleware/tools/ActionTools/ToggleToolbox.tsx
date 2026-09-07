import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import { PanelLeftDashed } from 'lucide-react';

export default function ToggleToolbox() {
  const showToolbox = usePipelineStoreSelector(state => state.showToolbox);
  const { toggleToolbox } = usePipelineStore();

  return <>
    <GenericToggleButtonGroup variant="standard" id="toggle-toolbox-toggle" items={[
      {
        tooltip: "Toggle Toolbox",
        icon: <PanelLeftDashed />,
        onClick: () => toggleToolbox(),
        selected: showToolbox,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
