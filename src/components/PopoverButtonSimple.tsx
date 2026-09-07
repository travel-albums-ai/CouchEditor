import { Popover } from '@mui/material';
import { cloneElement, ReactNode, useEffect, useState } from 'react';

interface PopoverButtonProps {
  children: ReactNode;
  trigger?: ReactNode;
  preOpen?: boolean;
}

export default function PopoverButtonSimple({
  trigger,
  children,
  preOpen = false,
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

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        transitionDuration={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
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
      >
        {children}
      </Popover>
    </>
  );
}
