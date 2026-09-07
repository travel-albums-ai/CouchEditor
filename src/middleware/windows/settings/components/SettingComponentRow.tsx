import { Box, Typography } from '@mui/material';

type SettingComponentRowProps = {
  label: string
  component: React.ReactNode
}

export default function SettingComponentRow({
  label,
  component,
}: SettingComponentRowProps) {
  return (
    <Box sx={boxSx}>
      <Typography variant="caption" color="textSecondary" sx={{ flex: 1 }}>{label}</Typography>
      {component}
    </Box>
  )
}

const boxSx = {
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  p: 0.75,
  px: 1,
  gap: 0.5,
  borderRadius: 2,
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    bgcolor: 'action.hover',
  }
}
