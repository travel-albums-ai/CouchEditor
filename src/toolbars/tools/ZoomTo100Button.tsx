import { Box, Tooltip } from '@mui/material';
import { Scan } from 'lucide-react';

import { usePipelineCanvas } from '@/hooks/usePipelineCanvas';

export default function ZoomTo100Button() {
  const { actionsRef } = usePipelineCanvas();

  return (
    <Tooltip title="Zoom to 100%" placement="right">
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
        onClick={() => actionsRef.current.zoomTo100()}
      >
        <Scan size={16} />
      </Box>
    </Tooltip>
  );
}
