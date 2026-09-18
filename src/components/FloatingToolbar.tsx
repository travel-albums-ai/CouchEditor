import { Stack, alpha } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type FloatingStackProps = {
  id?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  asIs?: boolean;
};

export default function FloatingToolbar({
  id,
  children,
  sx,
  asIs,
}: FloatingStackProps) {

  return (
    <Stack
      id={id}
      direction="row"
      spacing={1}
      sx={[
        {
          m: 0.75,
          bgcolor: theme => alpha(theme.palette.background.paper, 0.8),
          border: asIs ? 0 : 1,
          borderColor: 'divider',
          p: asIs ? 0 : 1,
          borderRadius: 3,
          boxShadow: 2,
          backdropFilter: 'blur(4px)',
          transition: 'box-shadow 0.35s ease, background-color 0.35s ease',
          '&:hover': {
            bgcolor: theme => alpha(theme.palette.background.paper, 0.95),
            boxShadow: theme => `0 2px 10px -2px ${alpha(theme.palette.primary.main, 0.65)}`,
          },
        },
        sx,
      ]}
    >
      {children}
    </Stack>
  );
}
