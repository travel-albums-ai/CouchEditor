import { alpha, Box, Typography, useTheme } from '@mui/material';
import { GalleryHorizontalEnd, Users2, Workflow } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import SolidChip from '@/components/SolidChip';
import type { SavedPipeline } from '@/context/pipelineStore';
import PipelineSelector from '@/middleware/windows/pipeline/components/PipelineSelector';

type HeaderProps = {
  currentPipelineId: string;
  pipelines: SavedPipeline[];
  loadPipeline: (id: string) => void;
};

export default function MiddlePart({ currentPipelineId, pipelines, loadPipeline }: HeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.disabled', borderRadius: 2, p: 2, height: 42,
        bgcolor: alpha(theme.palette.divider, 0.03),
      }}>
        <Workflow size={16} />
        <Typography variant="subtitle2">{t('editor')}</Typography>
      </Box>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', borderRadius: 2, p: 2, height: 42,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.07),
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      }}>
        <GalleryHorizontalEnd size={16} />
        <Typography variant="subtitle2" sx={{ mr: 2 }}>{t('templates')}</Typography>
        <PipelineSelector
          currentPipelineId={currentPipelineId}
          pipelines={pipelines}
          loadPipeline={loadPipeline}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main', borderRadius: 2, p: 2, height: 42,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: alpha(theme.palette.secondary.main, 0.3),
        '&:hover': {
          bgcolor: alpha(theme.palette.secondary.main, 0.2),
        },

      }}>
        <Users2 size={16} />
        <Typography variant="subtitle2">{t('community')}</Typography>
        <Box sx={{ color: 'text.primary', bgcolor: theme => alpha(theme.palette.secondary.main, 0.2) }}>
          <SolidChip label={t('comingSoon')} />
        </Box>
      </Box>
    </Box>

  );
}
