import { Box } from '@mui/material';

import EndPart from '@/components/header/EndPart';
import StartPart from '@/components/header/StartPart';


export default function Header() {

  return (
    <Box sx={{
      px: 2, pr: 1.5, py: 1.5,
      bgcolor: 'background.paper', display: 'flex', flexDirection: 'row',
      justifyContent: 'space-between',
      boxShadow: theme => `0px 4px 4px -2px ${theme.palette.divider}`,
      zIndex: 10
    }}>
      <StartPart />
      <EndPart />
    </Box>
  );
}
