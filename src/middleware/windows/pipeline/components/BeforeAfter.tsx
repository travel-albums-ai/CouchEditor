import { Box, useTheme } from '@mui/material';
import { ChevronRight } from 'lucide-react';

export function BeforeAfter({ image2style }: { image2style: React.CSSProperties }) {
  const theme = useTheme();
  return  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    px: 0.5,
    overflow: 'hidden',
    justifyContent: 'center',
  }}>
    <img src="sample.jpg" style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />
    <ChevronRight color={theme.palette.text.disabled} style={{ opacity: 0.5 }} />
    <img src="sample.jpg" style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}`, ...image2style }} />
  </Box>
};
