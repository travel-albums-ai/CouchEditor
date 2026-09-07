import { Box } from '@mui/material';
import { formatForDisplay } from '@tanstack/react-hotkeys';

interface SidebarCoreButtonProps {
  shortcut?: string;
}

export default function KeyboardChip({
  shortcut,
}: SidebarCoreButtonProps) {

  return (
    <Box
      sx={{
        px: 1,
        py: 0.35,
        fontSize: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        bgcolor: 'action.hover',
        borderColor: 'action.selected',
        borderRadius: 1,
      }}
    >
      {shortcut && <kbd style={{ lineHeight: 1.2 }}>{formatForDisplay(shortcut)}</kbd>}
    </Box>
  );
}
