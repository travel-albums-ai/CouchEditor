import { Box, TextField, Typography } from '@mui/material';
import { cloneElement, useEffect, useState } from 'react';

type SettingToggleRowProps = {
  label: string
  icon?: React.ReactNode
  value: string
  onChange: (newValue: string) => void
}

export default function SettingFieldRow({
  label,
  icon,
  value,
  onChange,
}: SettingToggleRowProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleBlur = () => {
    if (localValue !== value) onChange(localValue)
  }

  return (
    <Box sx={boxSx}>
      {icon && cloneElement(icon, { size: 16, style: { opacity: 0.5, marginRight: 8 } })}
      <Typography variant="caption" color="textSecondary" sx={{ flex: 1, lineHeight: 1 }}>{label}</Typography>

      <TextField
        value={localValue}
        size="small"
        variant="outlined"
        onChange={(event) => setLocalValue(event.target.value)}
        onBlur={handleBlur}
        sx={{ width: '350px' }}
      />
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
  borderRadius: 2,
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    bgcolor: 'action.hover',
  }
}
