import { Stack, Typography } from '@mui/material';

export default function SettingsComponentRow({ label, disabled, children }: { label: string, disabled?: boolean, children: React.ReactNode }) {
  return (
    <Stack direction="row" sx={stackStyle}>
      <Typography
        sx={{ opacity: disabled ? 0.5 : 1 }}
        variant="caption" color="textSecondary"
      >
        {label}
      </Typography>
      {children}
    </Stack>
  )
}

const stackStyle = {
  alignItems: 'center',
  justifyContent: 'space-between',
  p: 0.5,
  px: 1,
  borderRadius: 2,
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    bgcolor: 'action.hover',
  }
}
