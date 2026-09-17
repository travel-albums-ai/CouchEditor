import { Box, ClickAwayListener, Popover, PopoverProps, Popper } from '@mui/material';
import { cloneElement, ReactNode, useEffect, useState } from 'react';

interface PopoverButtonProps {
  children: ReactNode;
  trigger?: ReactNode;
  preOpen?: boolean;
  anchorHorizontal?: 'left' | 'center' | 'right';
  anchorVertical?: 'top' | 'center' | 'bottom';
  transformHorizontal?: 'left' | 'center' | 'right';
  transformVertical?: 'top' | 'center' | 'bottom';
  popoverProps?: Partial<PopoverProps>;
  nonModal?: boolean;
}

export default function PopoverButtonSimple({
  trigger,
  children,
  preOpen = false,
  anchorHorizontal = 'right',
  anchorVertical = 'top',
  transformHorizontal = 'left',
  transformVertical = 'bottom',
  popoverProps,
  nonModal = false,
}: PopoverButtonProps) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (preOpen) {
      if (!anchor) {
        setAnchor(document.body as unknown as HTMLButtonElement);
      }
    } else {
      setAnchor(null);
    }
  }, [preOpen]);

  return (
    <>
      {trigger &&
        cloneElement(trigger as any, {
          onClick: (e: any) => {
            setAnchor(e.currentTarget as HTMLButtonElement);
          },
        })}

      {nonModal ? (
        <ClickAwayListener
          onClickAway={(event) => {
            if (anchor?.contains(event.target as Node)) {
              return;
            }

            setAnchor(null);
          }}
        >
          <Popper
            open={Boolean(anchor)}
            anchorEl={anchor}
            placement="right"
            sx={{ zIndex: 1300 }}
          >
            <Box sx={{
              overflow: 'visible',
              border: 1,
              p: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: 8,
            }}>
              {children}
            </Box>
          </Popper>
        </ClickAwayListener>
      ) : (
        <Popover
          open={Boolean(anchor)}
          anchorEl={anchor}
          transitionDuration={0}
          anchorOrigin={{
            vertical: anchorVertical,
            horizontal: anchorHorizontal,
          }}
          transformOrigin={{
            vertical: transformVertical,
            horizontal: transformHorizontal,
          }}
          onClose={() => setAnchor(null)}
          slotProps={{
            paper: {
              sx: {
                overflow: 'visible',
                border: 1,
                p: 1,
                borderColor: 'divider',
                borderRadius: 2,
                boxShadow: 8,
              },
            },
          }}
          {...popoverProps}
        >
          {children}
        </Popover>
      )}
    </>
  );
}
