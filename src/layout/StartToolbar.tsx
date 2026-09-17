import { Box, TextField } from '@mui/material';
import { CirclePlus, Copy, Download, Save, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore } from '@/context/pipelineStore';
import StartPart from '@/layout/StartPart';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import { usePipelineCanvas } from '@/middleware/windows/pipeline/usePipelineCanvas';

export const TOOLBAR_GAP = 4;

export default function StartToolbar() {
  const { t } = useTranslation();
  const { currentPipeline, setCurrentPipelineName, setCurrentPipelineDirty } = usePipelineStore();
  const { pipelineFileInputRef, actionsRef } = usePipelineCanvas();

  return <>
    <Box sx={{ left: TOOLBAR_GAP, top: TOOLBAR_GAP, overflow: 'visible', position: 'absolute', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', maxWidth: '70%' }}>
      <FloatingToolbar sx={{
        display: 'flex',
        flexDirection: 'row',
      }}>
        <StartPart />
      </FloatingToolbar>

      <FloatingToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          <input
            ref={pipelineFileInputRef}
            type="file"
            accept=".cep"
            hidden
            onChange={(event) => actionsRef.current.uploadPipeline(event)}
          />
        </Box>
      </FloatingToolbar>
    </Box>
  </>;
}
