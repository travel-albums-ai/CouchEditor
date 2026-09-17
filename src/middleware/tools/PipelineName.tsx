import { usePipelineStore } from '@/context/pipelineStore';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function PipelineName() {
  const { t } = useTranslation();
  const { currentPipeline, setCurrentPipelineName, setCurrentPipelineDirty } = usePipelineStore();

  return <>
    <TextField
      id="pipeline-name"
      size="small"
      value={currentPipeline.name}
      placeholder={t('pipelineTitlePlaceholder')}
      onChange={(event) => {
        setCurrentPipelineName(event.target.value);
        setCurrentPipelineDirty(true);
      }}
      sx={{ maxWidth: 400, minWidth: 300 }}
    />
  </>
}
