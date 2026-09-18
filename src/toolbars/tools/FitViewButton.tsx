import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineCanvas } from '@/hooks/usePipelineCanvas';
import { Maximize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FitViewButton() {
  const { actionsRef } = usePipelineCanvas();
  const { t } = useTranslation();

  return (
    <GenericToggleButtonGroup variant="standard" id="fit-view-button" items={[
      {
        tooltip: t('fitViewToggleTooltip'),
        icon: <Maximize2 size={16} />,
        onClick: () => actionsRef.current.fitView(),
        selected: false,
      },
    ] satisfies GenericToggleButtonProps[]} />
  );
}
