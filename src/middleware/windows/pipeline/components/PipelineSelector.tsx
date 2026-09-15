import { alpha, Box, ButtonBase, Chip, Popover, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

import type { SavedPipeline } from '@/context/pipelineStore';
import PipelineSelectorItem from '@/middleware/windows/pipeline/components/PipelineSelectorItem';
import PipelineSelectorItems from '@/middleware/windows/pipeline/components/PipelineSelectorItems';
import { Astroid, Camera, ChevronsDown, GalleryHorizontalEnd, User } from 'lucide-react';

type PipelineSelectorProps = {
  currentPipelineId: string;
  pipelines: SavedPipeline[];
  loadPipeline: (id: string) => void;
};

export default function PipelineSelector({
  currentPipelineId,
  pipelines,
  loadPipeline,
}: PipelineSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selectedPipeline = pipelines.find((pipeline) => pipeline.id === currentPipelineId);
  const isOpen = Boolean(anchorEl);
  const theme = useTheme()

  const handleSelect = (pipelineId: string) => {
    loadPipeline(pipelineId);
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonBase
        aria-label="Load pipeline"
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          height: 30,
          border: '1px solid',
          borderColor: theme => alpha(theme.palette.primary.main, 0.4),
          minWidth: 250,
          justifyContent: 'flex-start',
          px: 1,
          borderRadius: 1,
          color: 'inherit',
          typography: 'body2',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', flex: 1 }}>
          {selectedPipeline?.name ?? 'Load pipeline'}
          <ChevronsDown size={16} />
        </Box>
      </ButtonBase>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxHeight: '60vh',
            maxWidth: '850px',
            overflowY: 'hidden',
          }}
        >
          <Box sx={{ position: 'relative',
            backgroundImage: 'url(couceditor_header_background_850px.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',

          }}>
            <Box sx={{ py: 5, pl: 4, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', }}>
              <GalleryHorizontalEnd  size={64} color={theme.palette.primary.main} />
              <Box sx={{ borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography color="textPrimary" variant="h6">Pipeline Templates</Typography>
                <Typography color="textSecondary" variant="caption" sx={{ whiteSpace: 'wrap', width: '400px', display: 'block' }}>Kickstart your work with ready-made templates, and save time on repetitive tasks. Pick a template, customize it, and make it your own.</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ overflowY: 'auto', }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1, justifyContent: 'space-between', p: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search pipelines..."
                sx={{ flex: 1 }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Chip
                  label="All"
                  variant="outlined"
                />
                <Chip
                  label="Sample"
                  variant="outlined"
                />
                <Chip
                  label="Instagram"
                  variant="outlined"
                />
                <Chip
                  label="User"
                  variant="outlined"
                />
              </Box>
            </Box>

            <PipelineSelectorItems title="Sample Pipelines" icon={<Astroid />} description="Ready to use pipelines for common workflows">
              {pipelines.length > 0 && pipelines
                .filter(p => p.type === 'sample')
                .map((pipeline) => (
                  <PipelineSelectorItem pipeline={pipeline} onClick={() => handleSelect(pipeline.id)} />
                ))}
            </PipelineSelectorItems>

            <PipelineSelectorItems title="Instagram-Like Pipelines" icon={<Camera />} description="Pipelines inspired by Instagram's style">
              {pipelines.length > 0 && pipelines
                .filter(p => p.type === 'instagram')
                .map((pipeline) => (
                  <PipelineSelectorItem pipeline={pipeline} onClick={() => handleSelect(pipeline.id)} />
                ))}
            </PipelineSelectorItems>

            <PipelineSelectorItems title="User Pipelines" icon={<User />} description="Pipelines created by the user">
              {pipelines.length > 0 && pipelines
                .filter(p => p.type !== 'sample' && p.type !== 'instagram')
                .map((pipeline) => (
                  <PipelineSelectorItem pipeline={pipeline} onClick={() => handleSelect(pipeline.id)} />
                ))}
            </PipelineSelectorItems>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
