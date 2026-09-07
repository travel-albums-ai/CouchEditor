import { Box, Typography } from '@mui/material';
import { cloneElement } from 'react';

type SettingsGeneralRowProps = {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}

export default function SettingsGeneralRow({
  label,
  icon,
  children,
}: SettingsGeneralRowProps) {

  return (
    <Box sx={boxSx}>
      {icon && cloneElement(icon, { size: 16, style: { opacity: 0.5, marginRight: 8 } })}
      <Typography variant="caption" color="textSecondary" sx={{ flex: 1, lineHeight: 1 }}>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', flex: 1 }}>
        {children}
      </Box>
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
  width: '100%',
  borderRadius: 2,
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    bgcolor: 'action.hover',
  }
}
