import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import { PanelLeftDashed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ToggleToolbox() {
  const showToolbox = usePipelineStoreSelector(state => state.showToolbox);
  const { toggleToolbox } = usePipelineStore();
  const { t } = useTranslation()

  return <>
    <GenericToggleButtonGroup variant="standard" id="toggle-toolbox-toggle" items={[
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
        selected: showToolbox,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
