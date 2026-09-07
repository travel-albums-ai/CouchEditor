import { Box, Tooltip, Typography } from '@mui/material';
import { cloneElement, useEffect, useRef, useState } from 'react';

interface SidebarCoreButtonProps {
  icon?: React.ReactNode;
  count?: number | string;
  variant?: 'text' | 'header';
  minWidth?: number;
  height?: number;
  fontSize?: number;
  label?: string;
  borderless?: boolean;
  tooltip?: string;
}

export default function SolidChip({
  icon,
  count,
  label,
  variant = 'text',
  minWidth = 30,
  height = 20,
  fontSize = 10,
  borderless = false,
  tooltip,
}: SidebarCoreButtonProps) {

  const prevCount = useRef<number | string | undefined>(count);
  const isFirstRender = useRef(true);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevCount.current = count;
      return;
    }

    if (prevCount.current !== count) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 250);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
  }, [count]);

  const domContent = <Box
    sx={{
      height,
      fontSize,
      minWidth,
      px: 0.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: variant === 'header' ? 0.5 : 0.7,
      bgcolor: variant === 'header' ? 'action.selected' : 'transparent',
      border: borderless ? 'none' : '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      position: 'relative',
      overflow: 'hidden',

      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundColor: 'text.primary',
        opacity: 0,
        pointerEvents: 'none',
      },

      '&.flash::after': {
        animation: 'chipFlash 250ms ease',
      },

      '@keyframes chipFlash': {
        '0%': { opacity: 0.35 },
        '100%': { opacity: 0 },
      },
    }}
    className={flash ? 'flash' : ''}
  >
    {icon &&
        cloneElement(icon as React.ReactElement, {
          size: fontSize,
          style: { marginRight: 4 },
        })}

    <Typography variant="body2" sx={{ fontSize, lineHeight: 1 }}>
      {count} {label}
    </Typography>
  </Box>

  return <>
    {tooltip ? (
      <Tooltip title={tooltip} placement="top" arrow>
        {domContent}
      </Tooltip>
    ) : (
      domContent
    )}
  </>
}
