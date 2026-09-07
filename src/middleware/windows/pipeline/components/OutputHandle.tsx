import { useTheme } from '@mui/material';
import { Handle, Position } from "@xyflow/react";
import { SquareArrowRightExit } from 'lucide-react';

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
        <SquareArrowRightExit size={10} style={{ position: 'absolute', top: '3px', right: '3px' }} />
      </div>
    </Handle>
  </>;
}
