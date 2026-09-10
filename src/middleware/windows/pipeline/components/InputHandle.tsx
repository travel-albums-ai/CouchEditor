import { Box, useTheme } from '@mui/material';
import { Handle, Position } from "@xyflow/react";
import { Circle } from 'lucide-react';
import type { CSSProperties } from 'react';

export function InputHandle({
  id,
  position,
  style,
}: {
  id: string;
  position?: Position;
  style?: CSSProperties;
}) {
  const theme = useTheme()

  return <>
    <Handle
      type="target"
      style={{ width: '16px', height: '16px', backgroundColor: 'transparent', border: 0, ...style }}
      position={position ?? Position.Left}
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
          top: '0px',
          right: '2px',
          stroke: theme.palette.divider,
          fill: theme.palette.primary.main,
        }} />
      </Box>
    </Handle>
  </>;
}
