import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore } from '@/context/pipelineStore';
import { LayoutGrid, Table } from 'lucide-react';

export default function ToggleToolboxShape() {
  const { setState, toolboxAsGrid } = usePipelineStore();

  return <>
    <GenericToggleButtonGroup variant="outlined" id="toggle-toolbox-toggle" items={[
      {
        tooltip: "Table view",
        icon: <Table />,
        onClick: () => setState((prev) => ({ ...prev, toolboxAsGrid: false })),
        selected: !toolboxAsGrid,
      },
      {
        tooltip: "Grid view",
        icon: <LayoutGrid />,
        onClick: () => setState((prev) => ({ ...prev, toolboxAsGrid: true })),
        selected: toolboxAsGrid,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
