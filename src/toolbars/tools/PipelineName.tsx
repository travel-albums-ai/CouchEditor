import { usePipelineStore } from '@/context/pipelineStore';
import { InputBase } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function PipelineName() {
  const { t } = useTranslation();
  const { currentPipeline, setCurrentPipelineName, setCurrentPipelineDirty } = usePipelineStore();

  return <InputBase
    id="pipeline-name"
    value={currentPipeline.name}
    placeholder={t('pipelineTitlePlaceholder')}
    onChange={(event) => {
      setCurrentPipelineName(event.target.value);
      setCurrentPipelineDirty(true);
    }}
    sx={{ maxWidth: 400, minWidth: 300, px: 1,
      '& .MuiInputBase-input': {
        animation: 'none',
      },
    }}
  />;
}
