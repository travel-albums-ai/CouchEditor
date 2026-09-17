import { Box } from '@mui/material';
import { Trash2 } from 'lucide-react';
import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

type PipelineCanvasOverlaysProps = {
  currentPipelineId: string;
  trashActive: boolean;
  trashRef: RefObject<HTMLDivElement | null>;
  onDelete: () => void;
};

export default function DeleteButton({
  currentPipelineId,
  trashActive,
  trashRef,
  onDelete,
}: PipelineCanvasOverlaysProps) {
  const { t } = useTranslation();

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
