import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineCanvas } from '@/middleware/windows/pipeline/usePipelineCanvas';
import { Copy, Download, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SaveCloneUploadToggle() {
  const { t } = useTranslation();
  const { pipelineFileInputRef, actionsRef } = usePipelineCanvas();

  return <>
    <GenericToggleButtonGroup id="pipeline-save" items={[
      {
        tooltip: t('savePipeline'),
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
