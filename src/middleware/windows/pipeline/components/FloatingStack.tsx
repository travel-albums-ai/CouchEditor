import { useSettingsStoreSelector } from '@/context/settingsStore';
import { Stack } from '@mui/material';

export default function FloatingStack({ children, sx } : { children: React.ReactNode, sx?: object }) {
  const performanceMode = useSettingsStoreSelector(s => s.performanceMode)

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ position: 'absolute',
        zIndex: 10,
        bgcolor: theme => performanceMode
          ? `color-mix(in srgb, ${theme.palette.background.paper} 95%, transparent 8%)`
          : 'background.paper',
        backdropFilter: 'blur(4px)',
        border: '1px solid',
        borderColor: 'divider',
        p: 1,
        borderRadius: 2,
        transition: 'all 0.75s ease',
        '&:hover': {
          border: theme => `1px solid ${theme.palette.primary.main}42`,
          boxShadow: theme => `0 0px 3px ${theme.palette.primary.main}`,
          bgcolor: theme => performanceMode
            ? `color-mix(in srgb, color-mix(in srgb, ${theme.palette.background.paper} 95%, ${theme.palette.primary.main} 3%) 95%, transparent 8%)`
            : 'background.paper',
        },
        boxShadow: performanceMode
          ? 4
          : 0,
        ...sx
      }}
    >
      {children}
    </Stack>
  );
}
