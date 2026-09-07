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
        alignItems: 'center',bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        p: 1, borderRadius: 2,
        boxShadow: performanceMode ? 4 : 0,
        ...sx
      }}
    >
      {children}
    </Stack>
  );
}
