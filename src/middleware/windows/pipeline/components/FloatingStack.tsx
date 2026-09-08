import { useSettingsStoreSelector } from '@/context/settingsStore';
import { Stack, alpha } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type FloatingStackProps = {
  id?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export default function FloatingStack({
  id,
  children,
  sx,
}: FloatingStackProps) {
  const performanceMode = useSettingsStoreSelector(s => s.performanceMode);

  return (
    <Stack
      id={id}
      direction="row"
      spacing={1}
      sx={[
        {
          position: 'absolute',
          zIndex: 10,
          bgcolor: theme =>
            performanceMode
              ? alpha(theme.palette.background.paper, 0.95)
              : theme.palette.background.paper,
          border: 1,
          borderColor: 'divider',
          p: 1,
          borderRadius: 2,

          ...(performanceMode && {
            boxShadow: 4,
            backdropFilter: 'blur(4px)',
            transition: 'border-color 0.15s ease, box-shadow 0.35s ease, background-color 0.5s ease',

            '&:hover': {
              borderColor: theme =>
                alpha(theme.palette.primary.main, 0.26),
              boxShadow: theme =>
                `0 0 3px ${alpha(theme.palette.primary.main, 0.8)}`,
            },
          }),
        },
        sx,
      ]}
    >
      {children}
    </Stack>
  );
}
