import { Box, Stack, TextField } from '@mui/material';
import { CirclePlus, Copy, Download, Save, Trash2, Upload } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';

import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import LoadingBar from '@/components/LoadingBar';
import StatusBar from '@/components/StatusBar';
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
}: PipelineCanvasOverlaysProps) {
  return <>
    <FloatingStack sx={{ bottom: 10, left: '30%', right: '30%', overflow: 'auto' }} id="pipeline-status">
      <Box
        id="status-bar"
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1.5,
          p: 0.5,
          py: 0,
          position: 'relative',
        }}
      >
        <LoadingBar />
        <StatusBar />
      </Box>
    </FloatingStack>

    <FloatingStack sx={{ top: 12, right: 12 }} id="pipeline-actions">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <GenericToggleButtonGroup id="pipeline-new" variant="standard" items={[
          {
            tooltip: 'New pipeline',
            icon: <CirclePlus />,
            onClick: onClearWorkspace,
            title: '',
          },
        ] satisfies GenericToggleButtonProps[]} />
        <TextField
          id="pipeline-name"
          size="small"
          value={currentPipelineName}
          placeholder="Pipeline title..."
          onChange={(event) => onNameChange(event.target.value)}
          sx={{ maxWidth: 400, minWidth: 300 }}
        />
        <GenericToggleButtonGroup id="pipeline-save" items={[
          {
            tooltip: 'Save pipeline',
            icon: <Save />,
            onClick: onSave,
            title: '',
          },
          {
            tooltip: 'Save as clone',
            icon: <Copy />,
            onClick: onSaveAsCopy,
            title: '',
          },
        ] satisfies GenericToggleButtonProps[]} />
        <GenericToggleButtonGroup id="pipeline-transfer" items={[
          {
            tooltip: 'Download pipeline',
            icon: <Download />,
            onClick: onDownload,
            title: 'Export',
          },
          {
            tooltip: 'Upload pipeline',
            icon: <Upload />,
            onClick: () => pipelineFileInputRef.current?.click(),
            title: 'Import',
          },
        ] satisfies GenericToggleButtonProps[]} />
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
        title={currentPipelineId ? 'Delete current pipeline' : 'No saved pipeline selected'}
      >
        <Trash2 size={22} />
      </Box>
    </Stack>
  </>;
}
