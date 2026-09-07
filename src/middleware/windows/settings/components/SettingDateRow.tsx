import DatePickerCustom from '@/middleware/windows/settings/components/DatePickerCustom';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

type SettingToggleRowProps = {
  label: string,
  fieldLabel?: string,
  value: number
  onChange: (newValue: number) => void,
  disabled?: boolean
}

export default function SettingDateRow({
  label,
  fieldLabel,
  value,
  onChange,
  disabled = false
}: SettingToggleRowProps) {
  const [localValue, setLocalValue] = useState<dayjs.Dayjs | null>(value ? dayjs(value) : null)

  useEffect(() => {
    setLocalValue(value ? dayjs(value) : null)
  }, [value])

  return (
    <Box sx={boxSx}>
      <Typography variant="caption" color="textSecondary" sx={{ flex: 1 }}>{label}</Typography>
      <DatePickerCustom
        label={fieldLabel}
        disabled={disabled}
        value={localValue ? localValue.valueOf() : 0}
        onChange={(newValue) => {
          setLocalValue(newValue ? dayjs(newValue) : null);
          onChange(newValue);
        }}
        size="small"
        margin="none"
        sx={{
          width: disabled ? 120 : 150,
        }}
      />
    </Box>
  )
}

const boxSx = {
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  p: 0.5,
  px: 0.75,
  borderRadius: 2,
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    bgcolor: 'action.hover',
  }
}
