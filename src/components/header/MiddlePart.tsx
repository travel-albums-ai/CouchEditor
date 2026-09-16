import { alpha, Box, Typography, useTheme } from '@mui/material';
import { GalleryHorizontalEnd, Home, Workflow } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
      <a href="https://homepage.couch-editor.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,
          // color: 'text.disabled',
          borderRadius: 2, p: 2, height: 42,
          bgcolor: alpha(theme.palette.primary.main, 0.2),
          color: 'primary.main',
        }}>
          <Home size={16} />
          <Typography variant="subtitle2">Homepage</Typography>
        </Box>
      </a>
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
    </Box>

  );
}
