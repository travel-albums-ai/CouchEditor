import { Box } from '@mui/material';
import { MoveRight } from 'lucide-react';

export function BeforeAfter({ image2style }: { image2style: React.CSSProperties }) {
  return  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, justifyContent: 'center' }}>
    <img src="sample.jpg" style={{ maxWidth: '50px' }} />
    <MoveRight />
    <img src="sample.jpg" style={{ maxWidth: '50px', ...image2style }} />
  </Box>
};
