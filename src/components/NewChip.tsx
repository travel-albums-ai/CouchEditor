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
  sx?: object;
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
  sx
}: SidebarCoreButtonProps) {
  const previousCount = useRef(count);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (previousCount.current === count) return;

    previousCount.current = count;
    setFlash(true);

    const timeout = window.setTimeout(() => {
      setFlash(false);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [count]);

  const content = (
    <Box
      sx={{
        fontSize,
        px: 1.5,
        py: 0.75,
        m: 0.25,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        opacity: 0.75,

        boxShadow: theme =>
          disabled
            ? 'none'
            : `0 0 4px 0 ${theme.palette.divider}`,

        bgcolor: theme => {
          if (flash) {
            return alpha(theme.palette.text.primary, 0.12);
          }

          if (variant === 'important') {
            return alpha(theme.palette.primary.main, 0.35);
          }

          return disabled
            ? alpha(theme.palette.divider, 0.05)
            : 'transparent';
        },

        border: borderless ? 'none' : '1px solid',
        borderColor: 'divider',
        borderRadius: 2,

        transition: 'background-color 250ms ease',

        // Avoid transition when the component is disabled.
        ...(disabled && {
          transition: 'none',
        }),
        ...sx,
      }}
    >
      {icon &&
        cloneElement(icon as React.ReactElement, {
          size: fontSize,
          style: {
            marginRight: 4,
          },
        })}

      <Typography
        variant="body2"
        sx={{
          fontSize,
          lineHeight: 1,
          textWrap: 'nowrap',
        }}
      >
        {count} {label}
      </Typography>
    </Box>
  );

  return tooltip ? (
    <Tooltip title={tooltip} placement="top" arrow>
      {content}
    </Tooltip>
  ) : (
    content
  );
}
