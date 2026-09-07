import { Box, useTheme } from '@mui/material';

export default function OnboardingWrapper({ children, light = false }: { children: React.ReactNode, light?: boolean }) {
  const theme = useTheme();

  return (<>
    <Box sx={{
      p: 1,
      py: 2,
      boxShadow: 4,
      borderRadius: 2,
      mx: 2,
      bgcolor: !light ? `${theme.palette.background.paper}CC` : `${theme.palette.background.default}CC`,
      border: 1,
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      // height: '750px',
      overflowY: 'auto',
    }}>
      {children}
    </Box>
  </>)
}
