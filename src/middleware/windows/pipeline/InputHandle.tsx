import { useTheme } from '@mui/material';
import { Handle, Position } from "@xyflow/react";
import { SquareArrowRightEnter } from 'lucide-react';
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
      style={{ width: '16px', height: '16px', backgroundColor: theme.palette.divider, border: 0, ...style }}
      position={position ?? Position.Left}
      id={id}
    >
      <div style={{ position: 'relative' }}>
        <SquareArrowRightEnter size={10} style={{ position: 'absolute', top: '3px', right: '3px' }} />
      </div>
    </Handle>
  </>;
}
