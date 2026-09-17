import { Box, Button, Tooltip } from '@mui/material';
import { X } from 'lucide-react';

export default function DialogCloseButton({ title, onClick } : { title: string, onClick: () => void }) {
  return (
    <Box sx={{ zIndex: 1, position: 'absolute', right: -16, top: -16 }}>
      <Tooltip title={title} placement="top" arrow>
        <Button onClick={onClick} variant="contained" size="large" sx={{ minWidth: "unset", p: 2 }}>
          <X size={16} />
        </Button>
      </Tooltip>
    </Box>
  )
}
