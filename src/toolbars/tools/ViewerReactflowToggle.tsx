import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import { Hand } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ViewerReactflowToggle() {
  const lockReactflow = usePipelineStoreSelector(state => state.lockReactflow);
  const { disableReactflow } = usePipelineStore();
  const { t } = useTranslation()

  return <>
    <GenericToggleButtonGroup variant="standard" id="dark-light-toggle" items={[
      {
        tooltip: t('viewerMode'),
        tooltipPlacement: 'right',
        icon: <Hand />,
        onClick: () => {
          disableReactflow();
        },
        selected: lockReactflow,
      }
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
