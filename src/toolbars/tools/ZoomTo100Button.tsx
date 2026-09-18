import { Scan } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineCanvas } from '@/hooks/usePipelineCanvas';

export default function ZoomTo100Button() {
  const { actionsRef } = usePipelineCanvas();
  const { t } = useTranslation();

  return (
    <GenericToggleButtonGroup variant="standard" id="zoom-to-100-toggle" items={[
      {
        tooltip: t('zoomTo100ToggleTooltip'),
        icon: <Scan size={16} />,
        onClick: () => actionsRef.current.zoomTo100(),
        selected: false,
      },
    ] satisfies GenericToggleButtonProps[]} />
  );
}
