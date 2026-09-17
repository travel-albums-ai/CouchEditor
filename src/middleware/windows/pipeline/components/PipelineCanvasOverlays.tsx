import { Box, TextField } from '@mui/material';
import { CirclePlus, Copy, Download, Save, Upload } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import EndPart from '@/components/header/EndPart';
import StartPart from '@/components/header/StartPart';
import LoadingBar from '@/components/LoadingBar';
import StatusBar from '@/components/StatusBar';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';

export const TOOLBAR_GAP = 4;

type PipelineCanvasOverlaysProps = {
  currentPipelineName: string;
  pipelineFileInputRef: RefObject<HTMLInputElement | null>;
  onClearWorkspace: () => void;
  onSave: () => void;
  onSaveAsCopy: () => void;
  onDownload: () => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (name: string) => void;
  onDelete: () => void;
  onOrganizeWithAI: () => void;
  organizingWithAI: boolean;
};

export default function PipelineCanvasOverlays({
  currentPipelineName,
  pipelineFileInputRef,
  onClearWorkspace,
  onSave,
  onSaveAsCopy,
  onDownload,
  onUpload,
  onNameChange,
}: PipelineCanvasOverlaysProps) {
  const { t } = useTranslation();

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
              onClick: onClearWorkspace,
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
            value={currentPipelineName}
            placeholder={t('pipelineTitlePlaceholder')}
            onChange={(event) => onNameChange(event.target.value)}
            sx={{ maxWidth: 400, minWidth: 300 }}
          />
          <GenericToggleButtonGroup id="pipeline-save" items={[
            {
              tooltip: t('savePipeline'),
              icon: <Save />,
              onClick: onSave,
              title: '',
            },
            {
              tooltip: t('savePipelineAsClone'),
              icon: <Copy />,
              onClick: onSaveAsCopy,
              title: '',
            },
            {
              tooltip: t('export'),
              icon: <Download />,
              onClick: onDownload,
              title: '',
            }
          ] satisfies GenericToggleButtonProps[]} />
          <input
            ref={pipelineFileInputRef}
            type="file"
            accept=".cep"
            hidden
            onChange={onUpload}
          />
        </Box>
      </FloatingToolbar>
    </Box>

    <Box sx={{ bottom: TOOLBAR_GAP, left: '0%', right: '0%', overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center' }} id="pipeline-overlays">
      <FloatingToolbar sx={{
        minWidth: '900px',
        maxWidth: '1200px'
      }}>
        <LoadingBar />
        <StatusBar />
      </FloatingToolbar>
    </Box>

    <Box sx={{ top: TOOLBAR_GAP, right: TOOLBAR_GAP, overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center' }} id="pipeline-actions">
      <FloatingToolbar>
        <EndPart />
      </FloatingToolbar>
    </Box>
  </>;
}
