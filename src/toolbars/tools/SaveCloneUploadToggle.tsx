import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineCanvas } from '@/hooks/usePipelineCanvas';
import { Copy, Download, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SaveCloneUploadToggle() {
  const { t } = useTranslation();
  const { actionsRef } = usePipelineCanvas();

  return <>
    <GenericToggleButtonGroup id="pipeline-save-toggle" items={[
      {
        tooltip: t('savePipeline'),
        meta: {
          name: 'saveCurrent',
          description: 'Save the current pipeline',
          icon: <Save />,
          group: 'pipeline',
        },
        icon: <Save />,
        onClick: () => actionsRef.current.saveCurrent(),
        title: '',
      },
      {
        tooltip: t('savePipelineAsClone'),
        icon: <Copy />,
        onClick: () => actionsRef.current.saveAsCopy(),
        title: '',
      },
      {
        tooltip: t('export'),
        icon: <Download />,
        onClick: () => actionsRef.current.downloadPipeline(),
        title: '',
      }
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
