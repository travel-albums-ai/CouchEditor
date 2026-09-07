import { Box, Switch, Typography } from '@mui/material';
import { cloneElement } from 'react';

type SettingToggleRowProps = {
  label: string
  icon?: React.ReactNode
  selected: boolean
  onChange: () => void
  activeIcon?: React.ReactNode
  inactiveIcon?: React.ReactNode,
  disabled?: boolean
}

export default function SettingToggleRow({
  label,
  icon,
  selected,
  onChange,
  activeIcon,
  inactiveIcon,
  disabled = false
}: SettingToggleRowProps) {
  return (
    <Box sx={boxSx}>
      {icon && cloneElement(icon, { size: 16, style: { opacity: !selected ? 1 : 0.5, marginRight: 4 } })}
      <Typography variant="caption" color="textSecondary" sx={{ flex: 1, lineHeight: 1 }}>{label}</Typography>
      {activeIcon && cloneElement(activeIcon, { size: 16, style: { opacity: !selected ? 1 : 0.5 } })}
      <Switch checked={selected} onChange={onChange} size="small" disabled={disabled} />
      { inactiveIcon && cloneElement(inactiveIcon, { size: 16, style: { opacity: !selected ? 0.5 : 1 } }) }
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
