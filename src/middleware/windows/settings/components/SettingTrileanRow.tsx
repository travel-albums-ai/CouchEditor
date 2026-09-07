import { Box, Slider, Typography } from '@mui/material';
import { cloneElement } from 'react';

type SettingToggleRowProps = {
  label: string
  selected: boolean | null
  onChange: (value: boolean | null) => void
  activeIcon?: React.ReactNode
  inactiveIcon?: React.ReactNode
}

export default function SettingTrileanRow({
  label,
  selected,
  onChange,
  activeIcon,
  inactiveIcon
}: SettingToggleRowProps) {
  return (
    <Box sx={boxSx} onClick={() => { }}>
      <Typography variant="caption" color="textSecondary" sx={{ flex: 1 }}>{label}</Typography>
      {activeIcon && cloneElement(activeIcon, { size: 16, style: { opacity: selected === false ? 1 : 0.5 } })}
      <Slider
        step={1}
        sx={{
          width: 40, mx: 1, borderRadius: 4,
          color: theme => selected === null ? theme.palette.text.disabled : theme.palette.primary.main
        }}
        marks
        min={-1}
        max={1}
        value={selected === null ? 0 : selected ? 1 : -1}
        onChange={(event, newValue: number | number[]) => {
          const v = Array.isArray(newValue) ? newValue[0] : newValue
          if (v === 0) onChange(null) // set to null
          else if (v === -1) onChange(false) // set to false
          else if (v === 1) onChange(true) // set to true
        }} />
      { inactiveIcon && cloneElement(inactiveIcon, { size: 16, style: { opacity: selected !== true ? 0.5 : 1 } }) }
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
