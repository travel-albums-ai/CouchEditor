import { alpha, Box, Tooltip, Typography } from '@mui/material';
import { cloneElement, useEffect, useRef, useState } from 'react';

interface SidebarCoreButtonProps {
  icon?: React.ReactNode;
  count?: number | string;
  variant?: 'text' | 'important';
  minWidth?: number;
  height?: number;
  fontSize?: number;
  label?: string;
  borderless?: boolean;
  tooltip?: string;
  disabled?: boolean;
}

export default function NewChip({
  icon,
  count,
  label,
  variant = 'text',
  fontSize = 10,
  borderless = false,
  tooltip,
  disabled = false,
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
      fontSize,
      px: 1.5,
      py: 0.75,
      m: 0.25,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.75,
      boxShadow: theme => disabled ? 'unset' : `0 0 4px 0px ${theme.palette.divider}`,
      bgcolor: theme => variant === 'important'
        ? alpha(theme.palette.primary.main, 0.35)
        : disabled ? alpha(theme.palette.divider, 0.05) : 'transparent',
      border: borderless ? 'none' : '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
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
