import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineCanvas } from '@/hooks/usePipelineCanvas';
import { CirclePlus, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NewUploadToggle() {
  const { t } = useTranslation();
  const { pipelineFileInputRef, actionsRef } = usePipelineCanvas();

  return <>
    <GenericToggleButtonGroup id="pipeline-new" items={[
      {
        tooltip: t('newPipeline'),
        icon: <CirclePlus />,
        onClick: () => actionsRef.current.clearWorkspace(),
        title: '',
      },
      {
        tooltip: t('import'),
        icon: <Upload />,
        onClick: () => pipelineFileInputRef.current?.click(),
        title: '',
      },
    ] satisfies GenericToggleButtonProps[]} />
    <input
      ref={pipelineFileInputRef}
      type="file"
      accept=".cep"
      hidden
      onChange={(event) => actionsRef.current.uploadPipeline(event)}
    />
  </>
}
