import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore } from '@/context/pipelineStore';
import { PanelLeftDashed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ToggleToolbox() {
  const { toggleToolbox } = usePipelineStore();
  const { t } = useTranslation()

  return <>
    <GenericToggleButtonGroup variant="outlined" id="toggle-toolbox-toggle" items={[
      {
        kbd: 'Alt+t',
        meta: {
          name: t('toolboxName'),
          description: t('toolboxDescription'),
          icon: <PanelLeftDashed />,
          group: t('toolsGroup')
        },
        tooltip: t('toolboxToggleTooltip'),
        icon: <PanelLeftDashed />,
        onClick: () => toggleToolbox(),
        selected: false,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
