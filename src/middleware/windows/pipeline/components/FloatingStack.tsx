import { Stack, alpha } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type FloatingStackProps = {
  id?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  asIs?: boolean;
};

export default function FloatingStack({
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
          position: 'absolute',
          zIndex: 10,
          bgcolor: theme => alpha(theme.palette.background.paper, 0.9),
          border: asIs ? 0 : 1,
          borderColor: 'divider',
          p: asIs ? 0 : 1,
          borderRadius: 2,
          boxShadow: 2,
          backdropFilter: 'blur(4px)',
          transition: 'box-shadow 0.35s ease',
          '&:hover': {
            boxShadow: 4,
          },
        },
        sx,
      ]}
    >
      {children}
    </Stack>
  );
}
