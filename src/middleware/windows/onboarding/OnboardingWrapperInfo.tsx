import { Box, useTheme } from '@mui/material';

export default function OnboardingWrapperInfo({ children, light = false, sx }: { children: React.ReactNode, light?: boolean, sx?: Record<string, unknown> }) {
  const theme = useTheme();

  return (<>
    <Box sx={{
      boxShadow: 1,
      borderRadius: 2,
      mx: 2,
      bgcolor: !light ? `${theme.palette.background.paper}CC` : `${theme.palette.background.default}CC`,
      border: 1,
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
      transition: 'all 0.5s',
      '&:hover': {
        boxShadow: 4,
      },
      ...sx,
    }}>
      {children}
    </Box>
  </>)
}
