import { Box, useTheme } from '@mui/material';
import { Handle, Position } from "@xyflow/react";
import { Circle } from 'lucide-react';

export function OutputHandle({ id, position }: { id: string; position?: Position }) {
  const theme = useTheme()

  return <>
    <Handle
      type="source"
      style={{ width: '16px', height: '16px', backgroundColor: 'transparent', border: 0 }}
      position={position ?? Position.Right}
      id={id}
    >
      <Box sx={{ position: 'relative',
        opacity: 0.5,
        filter: 'grayscale(0.5)',
        transition: 'opacity 0.25s ease, filter 0.25s ease',
        '&:hover': {
          opacity: 1,
          filter: 'grayscale(0)',
        },
      }}>
        <Circle size={10} style={{
          position: 'absolute',
          right: '3px',
          stroke: theme.palette.divider,
          fill: theme.palette.primary.main,
        }} />
      </Box>
    </Handle>
  </>;
}
