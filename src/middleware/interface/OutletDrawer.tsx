
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function OutletDrawer() {
  return <>
    <Box
      id="outlet-drawer"
      sx={{
        flexGrow: 1,
        p: 0,
        height: '100%',
        display: 'flex',
        borderRadius: 2,
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          overflowX: 'visible',
          borderRadius: 2,
          p: 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  </>
}
