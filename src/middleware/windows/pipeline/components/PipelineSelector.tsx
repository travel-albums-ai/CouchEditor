import { alpha, Box, ButtonBase, Popover, Typography } from '@mui/material';
import { useState } from 'react';

import type { SavedPipeline } from '@/context/pipelineStore';
import { ChevronsDown } from 'lucide-react';
import { MinimapPipeline } from './MinimapPipeline';

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
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
            gap: 1,
            p: 1.5,
            maxWidth: 'min(760px, calc(100vw - 32px))',
          }}
        >
          {pipelines.length > 0 ? pipelines.map((pipeline) => (
            <ButtonBase
              key={pipeline.id}
              onClick={() => handleSelect(pipeline.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1,
                minHeight: 66,
                p: 1,
                borderRadius: 2,
                textAlign: 'left',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <MinimapPipeline pipeline={pipeline} />
              <Typography
                variant="body2"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {pipeline.name}
              </Typography>
            </ButtonBase>
          )) : (
            <Typography variant="body2" color="text.secondary" sx={{ gridColumn: '1 / -1', p: 1 }}>
              No saved pipelines
            </Typography>
          )}
        </Box>
      </Popover>
    </>
  );
}
