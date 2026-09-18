import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import { MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PointerReactflowToggle() {
  const lockReactflow = usePipelineStoreSelector(state => state.lockReactflow);
  const { enableReactflow } = usePipelineStore();
  const { t } = useTranslation()

  return <>
    <GenericToggleButtonGroup variant="standard" id="dark-light-toggle" items={[
      {
        tooltip: t('interactiveMode'),
        icon: <MousePointer2 />,
        tooltipPlacement: 'right',
        onClick: () => {
          enableReactflow();
        },
        selected: !lockReactflow,
      }
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
