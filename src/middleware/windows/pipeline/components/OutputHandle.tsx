import { alpha, useTheme } from '@mui/material';
import { Handle, Position } from "@xyflow/react";
import { Circle } from 'lucide-react';

export function OutputHandle({ id, position }: { id: string; position?: Position }) {
  const theme = useTheme()

  return <>
    <Handle
      type="source"
      style={{ width: '16px', height: '16px', backgroundColor: theme.palette.background.paper, border: 0 }}
      position={position ?? Position.Right}
      id={id}
    >
      <div style={{ position: 'relative' }}>
        <Circle size={10} style={{
          position: 'absolute',
          top: '3px',
          right: '3px',
          stroke: theme.palette.divider,
          fill: alpha(theme.palette.secondary.main, 0.5),
        }} />
      </div>
    </Handle>
  </>;
}
