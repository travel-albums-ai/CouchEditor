import {
  Box,
  ClickAwayListener,
  Fade,
  Paper
} from '@mui/material';
import { useRef, useState } from 'react';

export default function CustomPopoverForTrigger({ preOpen = false, trigger, children }: { preOpen?: boolean, trigger?: React.ReactNode, children?: React.ReactNode }) {
  const [open, setOpen] = useState(preOpen)
  const anchorRef = useRef(null)

  return (
    <Box sx={{ flex: 1 }}>
      <Box
        ref={anchorRef}
        sx={{
          position: 'relative',
        }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box>
            <div onClick={() => setOpen(true)}>{trigger}</div>

            <Fade in={open}>
              <Paper
                elevation={2}
                sx={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: 0,
                  p: 0.5,
                  minHeight: 400,
                  maxHeight: 600,
                  overflow: 'auto',
                  width: '1200px',
                  bgcolor: (theme) => `${theme.palette.background.paper}AA`,
                  backdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  boxShadow: 8,
                }}
              >
                <Box>
                  {children}
                </Box>
              </Paper>
            </Fade>
          </Box>
        </ClickAwayListener>
      </Box>
    </Box>
  )
}
