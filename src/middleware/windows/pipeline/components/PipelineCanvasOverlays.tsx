import { Box, Button, Stack, TextField } from '@mui/material';
import { CirclePlus, Copy, Download, Save, Trash2, Upload } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import LoadingBar from '@/components/LoadingBar';
import StatusBar from '@/components/StatusBar';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import FloatingStack from './FloatingStack';

type PipelineCanvasOverlaysProps = {
  currentPipelineId: string;
  currentPipelineName: string;
  performanceMode: boolean;
  trashActive: boolean;
  pipelineFileInputRef: RefObject<HTMLInputElement | null>;
  trashRef: RefObject<HTMLDivElement | null>;
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
  currentPipelineId,
  currentPipelineName,
  performanceMode,
  trashActive,
  pipelineFileInputRef,
  trashRef,
  onClearWorkspace,
  onSave,
  onSaveAsCopy,
  onDownload,
  onUpload,
  onNameChange,
  onDelete,
  onOrganizeWithAI,
  organizingWithAI,
}: PipelineCanvasOverlaysProps) {
  const { t } = useTranslation();

  return <>
    <Box sx={{ bottom: 10, left: '0%', right: '0%', overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center' }}>
      <FloatingToolbar sx={{
        minWidth: '900px',
        maxWidth: '1200px'
      }}>
        <LoadingBar />
        <StatusBar />
      </FloatingToolbar>
    </Box>



    <FloatingStack sx={{ top: 12, right: 12 }} id="pipeline-actions">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GenericToggleButtonGroup id="pipeline-new" variant="standard" items={[
          {
            tooltip: t('newPipeline'),
            icon: <CirclePlus />,
            onClick: onClearWorkspace,
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
        ] satisfies GenericToggleButtonProps[]} />
        <Button variant="contained" startIcon={<Download size={16} />} onClick={onDownload}>
          {t('export')}
        </Button>
        <Button variant="outlined" startIcon={<Upload size={16} />} onClick={() => pipelineFileInputRef.current?.click()}>
          {t('import')}
        </Button>
        <input
          ref={pipelineFileInputRef}
          type="file"
          accept=".cep"
          hidden
          onChange={onUpload}
        />
      </Box>
    </FloatingStack>

    <Stack
      id="pipeline-trash"
      direction="row"
      spacing={1}
      sx={{ position: 'absolute', bottom: 16, right: 232, zIndex: 10 }}
    >
      <Box
        ref={trashRef}
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid',
          borderColor: trashActive ? 'error.main' : 'divider',
          bgcolor: trashActive ? 'error.main' : 'background.default',
          color: trashActive ? 'error.contrastText' : 'text.secondary',
          boxShadow: performanceMode ? 4 : 0,
          transform: trashActive ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.15s ease-in-out, background-color 0.15s ease-in-out',
          cursor: currentPipelineId ? 'pointer' : 'default',
        }}
        onClick={onDelete}
        title={currentPipelineId ? t('deleteCurrentPipeline') : t('noSavedPipelineSelected')}
      >
        <Trash2 size={22} />
      </Box>
    </Stack>
  </>;
}
