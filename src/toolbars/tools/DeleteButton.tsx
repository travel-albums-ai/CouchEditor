import { Box } from '@mui/material';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { usePipelineStore } from '@/context/pipelineStore';
import { usePipelineTrash } from '@/hooks/usePipelineTrash';
import { INITIAL_EDGES, INITIAL_NODES } from '../../pipeline/pipelineConfig';

export default function DeleteButton() {
  const { t } = useTranslation();
  const { currentPipeline, deleteById, setCurrentPipeline } = usePipelineStore();
  const { trashActive, trashRef } = usePipelineTrash();
  const currentPipelineId = currentPipeline.id;

  const onDelete = () => {
    if (!currentPipelineId) return;
    if (!window.confirm(`Delete pipeline "${currentPipeline.name}"?`)) return;

    deleteById(currentPipelineId);
    setCurrentPipeline({ id: '', name: '', nodes: INITIAL_NODES, edges: INITIAL_EDGES, isDirty: false });
  };

  return <>
    <Box
      ref={trashRef}
      sx={{
        p: 1,
        py: 2,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: trashActive ? 'error.main' : 'divider',
        bgcolor: trashActive ? 'error.main' : 'background.default',
        color: trashActive ? 'error.contrastText' : 'text.secondary',
        transform: trashActive ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform 0.15s ease-in-out, background-color 0.15s ease-in-out',
        cursor: currentPipelineId ? 'pointer' : 'default',
      }}
      onClick={onDelete}
      title={currentPipelineId ? t('deleteCurrentPipeline') : t('noSavedPipelineSelected')}
    >
      <Trash2 size={16} />
    </Box>
  </>;
}
