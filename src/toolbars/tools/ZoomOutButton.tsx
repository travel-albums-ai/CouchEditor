import { ZoomOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineCanvas } from '@/hooks/usePipelineCanvas';

export default function ZoomOutButton() {
  const { actionsRef } = usePipelineCanvas();
  const { t } = useTranslation();

  return (
    <GenericToggleButtonGroup variant="standard" items={[
      {
        tooltip: t('zoomOutToggleTooltip'),
        icon: <ZoomOut size={16} />,
        onClick: () => actionsRef.current.zoomOut(),
        selected: false,
      },
    ] satisfies GenericToggleButtonProps[]} />
  );
}
