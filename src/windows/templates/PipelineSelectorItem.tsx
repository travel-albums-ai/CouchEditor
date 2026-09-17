import { alpha, Box, Button, Tooltip, Typography } from '@mui/material';

import type { SavedPipeline } from '@/context/pipelineStore';
import { MinimapPipeline } from '@/pipeline/components/MinimapPipeline';
import { ArrowRight } from 'lucide-react';

type PipelineSelectorProps = {
  pipeline: SavedPipeline;
  onClick: () => void;
};

export default function PipelineSelectorItem({
  pipeline,
  onClick,
}: PipelineSelectorProps) {

  return (
    <>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          px: 2,
          color: 'text.primary',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: 2,
            color: 'primary.main',
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <MinimapPipeline pipeline={pipeline} />
          <Typography
            variant="caption"
            color="inherit"
            sx={{ overflow: 'hidden', width: '80px', textOverflow: 'ellipsis', whiteSpace: 'wrap', flex: 1, cursor: 'default' }}
          >
            {pipeline.name}
          </Typography>
          <Tooltip title="Open selected pipeline" arrow>
            <Button variant="contained" disableElevation sx={{
              minWidth: 'unset',
              boxShadow: 0,
              borderRadius: 10,
              padding: 1,
              bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
              color: theme => theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme => alpha(theme.palette.primary.main, 0.2),
                boxShadow: 1,
              }
            }} onClick={onClick}>
              <ArrowRight size={16} />
            </Button>
          </Tooltip>
        </Box>
      </Box>

    </>
  );
}
