import { ZoomIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineCanvas } from '@/hooks/usePipelineCanvas';

export default function ZoomInButton() {
  const { actionsRef } = usePipelineCanvas();
  const { t } = useTranslation();

  return (
    <GenericToggleButtonGroup variant="standard" items={[
      {
        tooltip: t('zoomInToggleTooltip'),
        icon: <ZoomIn size={16} />,
        onClick: () => actionsRef.current.zoomIn(),
        selected: false,
      },
    ] satisfies GenericToggleButtonProps[]} />
  );
}
