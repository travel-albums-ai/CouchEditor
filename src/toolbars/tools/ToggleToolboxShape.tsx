import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore } from '@/context/pipelineStore';
import { LayoutGrid, Table } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ToggleToolboxShape() {
  const { setState, toolboxAsGrid } = usePipelineStore();
  const { t } = useTranslation();

  return <>
    <GenericToggleButtonGroup variant="outlined" id="toggle-toolbox-toggle" items={[
      {
        tooltip: t('toolboxTableView'),
        icon: <Table />,
        onClick: () => setState((prev) => ({ ...prev, toolboxAsGrid: false })),
        selected: !toolboxAsGrid,
      },
      {
        tooltip: t('toolboxGridView'),
        icon: <LayoutGrid />,
        onClick: () => setState((prev) => ({ ...prev, toolboxAsGrid: true })),
        selected: toolboxAsGrid,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
