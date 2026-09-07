import { Box, Popover, PopoverProps, ToggleButton } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface PopoverButtonProps {
  id?: string
  icon: ReactNode
  label: string
  children: ReactNode
  popoverProps?: Partial<PopoverProps>
  width?: number,
  trigger?: ReactNode,
  triggerNaked?: boolean,
  anchorVertical?: 'top' | 'bottom',
  anchorHorizontal?: 'left' | 'right' | 'center'
  transformVertical?: 'top' | 'bottom',
  transformHorizontal?: 'left' | 'right' | 'center',
  upsideDown?: boolean,
  hideArrow?: boolean,
}

export default function PopoverButton({
  id,
  icon,
  label,
  children,
  popoverProps,
  width,
  trigger,
  triggerNaked = true,
  anchorVertical = 'bottom',
  anchorHorizontal = 'left',
  transformVertical = 'top',
  transformHorizontal = 'left',
  upsideDown = false,
  hideArrow = false,
}: PopoverButtonProps) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)

  return (
    <>
      {trigger ? <Box
        id={id}
        sx={triggerNaked ? {
          display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
        } : {
          display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
          border: 1, borderColor: 'divider', borderRadius: 1, px: 1, py: 0.5,
          '&:hover': { bgcolor: 'action.hover' }
        }}
        onClick={(e) => setAnchor(e.currentTarget as HTMLButtonElement)}>{trigger}
        {hideArrow ? null : <>
          {upsideDown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </>}
      </Box> : null}
      {!trigger && <ToggleButton
        id={id}
        value="popover"
        size="small"
        selected={Boolean(anchor)}
        onChange={(e) => setAnchor(e.currentTarget as HTMLButtonElement)}
        aria-label={label}
        sx={{ height: 38, textTransform: 'none', display: 'flex', gap: 0.5 }}
      >
        {icon} {label}
        { hideArrow ? null : <>
          {upsideDown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </>}
      </ToggleButton>}

      {anchor && <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{
          vertical: anchorVertical,
          horizontal: anchorHorizontal,
        }}
        transformOrigin={{
          vertical: transformVertical,
          horizontal: transformHorizontal,
        }}
        slotProps={{
          paper: {
            sx: {
              width: width ?? 350,
              overflow: 'visible',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              boxShadow: 8
            },
          },
        }}
        {...popoverProps}
      >
        {children}
      </Popover>}
    </>
  )
}
