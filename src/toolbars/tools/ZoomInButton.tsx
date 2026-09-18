import { Box, Tooltip } from '@mui/material';
import { ZoomIn } from 'lucide-react';

import { usePipelineCanvas } from '@/hooks/usePipelineCanvas';

export default function ZoomInButton() {
  const { actionsRef } = usePipelineCanvas();

  return (
    <Tooltip title="Zoom in" placement="right">
      <Box
        sx={{
          p: 1,
          py: 2,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
          color: 'text.secondary',
          cursor: 'pointer',
        }}
        onClick={() => actionsRef.current.zoomIn()}
      >
        <ZoomIn size={16} />
      </Box>
    </Tooltip>
  );
}
