import SolidChip from '@/components/SolidChip';
import { Box, Slider, Stack, Typography } from '@mui/material';

export default function SettingsSliderRow({ label, max = 100, value, onChange, disabled }: { label: string, value: number, onChange: (value: number) => void, disabled?: boolean, max?: number }) {
  return (
    <Stack direction="row" sx={stackStyle}>
      <Typography
        sx={{ opacity: disabled ? 0.5 : 1 }}
        variant="caption" color="textSecondary"
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Slider
          sx={{ width: 140 }}
          size="small"
          value={value}
          onChange={(_, value) => onChange(value as number)}
          min={0}
          max={max}
          disabled={disabled}
        />
        <SolidChip count={value} minWidth={50} />
      </Box>
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
