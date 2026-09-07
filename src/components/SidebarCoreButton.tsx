import SolidChip from '@/components/SolidChip';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import { cloneElement } from 'react';

interface SidebarCoreButtonProps {
  noCounts?: boolean;
  title: string;
  description?: string;
  icon?: React.ReactElement;
  children?: React.ReactNode;
  isActive: boolean;
  count?: number;
  typographySx?: any;
  onClick?: () => void;
  data?: any[];
  variant?: 'text' | 'header';
  beforeSlot?: React.ReactNode;
  height?: number;
  direct?: boolean;
  sx?: any;
}

export default function SidebarCoreButton({
  noCounts = false,
  title,
  icon,
  children,
  isActive,
  count,
  typographySx,
  onClick,
  variant = 'text',
  beforeSlot,
  height = 28,
  direct = true,
  sx
}: SidebarCoreButtonProps) {

  return (
    <Button
      fullWidth
      size="small"
      onClick={!direct ? onClick : undefined}
      onMouseDown={direct ? onClick : undefined}
      disableRipple
      tabIndex={onClick ? 0 : -1}
      sx={{
        height,
        textAlign: 'left',
        cursor: isActive ? 'default' : 'pointer',
        borderRadius: 2,
        color: isActive ? 'primary.main' : 'text.disabled',
        justifyContent: 'space-between',
        gap: 1,
        px: 1,
        py: 0.25,
        '&:hover': {
          bgcolor: 'action.hover',
          color: 'primary.main',
        },
        ...(isActive && {
          bgcolor: 'background.default',
        }),
        ...sx
      }}
    >
      {isActive && (
        <Box sx={{
          position: 'absolute',
          left: -2,
          top: 0,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Box sx={{ width: 3, height: '50%', bgcolor: 'primary.main', borderRadius: 2, opacity: 0.5 }} />
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
        {beforeSlot}
        {icon && cloneElement(icon, { style: { flex: '0 0 16px', marginLeft: 0 } })}
        <Typography
          variant="caption"
          color={isActive ? 'primary.main' : 'textPrimary'}
          sx={{
            overflow: 'hidden',
            fontWeight: isActive ? 'bold' : 'normal',
            lineHeight: 1.25, textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...typographySx
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        {!noCounts && count === undefined && <Skeleton variant="text" width={30} height={34} />}
        {!noCounts && Number(count) > 0 && <SolidChip count={count} label="" height={20} minWidth={30} fontSize={10} variant={variant} />}
        {children}
      </Box>
    </Button>
  );
}
