import { Box } from '@mui/material';

import EndPart from '@/components/header/EndPart';
import StartPart from '@/components/header/StartPart';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';


export default function Header() {

  return (
    <Box sx={{ left: 12, top: 12, overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <FloatingToolbar sx={{
        display: 'flex',
        flexDirection: 'row',
      }}>
        <StartPart />
        <EndPart />
      </FloatingToolbar>
    </Box>
  );
}
