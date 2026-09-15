import { alpha, Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cloneElement, useState } from 'react';
import stc from 'string-to-color';

function collapseStorageKey(uuid: string) {
  return `settings-section-${uuid}`;
}

export default function SettingsSection({ uuid, title, icon, guidance, children, gap = 0.5, divider = true, transparent = true, tint } : { uuid?: string, title?: string, icon?: React.ReactNode, guidance?: string, children?: React.ReactNode, gap?: number, divider?: boolean, transparent?: boolean, tint?: string }) {

  const [collapsed, setCollapsed] = useState(() => uuid ? localStorage.getItem(collapseStorageKey(uuid)) === 'true' : false)

  const toggleCollapsed = () => {
    if (!uuid) return
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem(collapseStorageKey(uuid), String(next))
  }

  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 0, m: 0.25, overflow: 'visible' }}>
    <Box sx={{
      mb: 1,
      p: 1,
      borderRadius: 3,
      bgcolor: theme => theme.palette.background.paper,
      boxShadow: theme => `0 0 16px -3px ${theme.palette.divider}`,
      borderColor: 'divider',
      transition: 'border-color 0.15s ease, box-shadow 0.35s ease, background-color 0.5s ease',
      '&:hover': {
        boxShadow: theme => `0 0 4px 0px ${theme.palette.divider}`,
      },
    }}
    >
      {(title || icon) && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, mb: children ? (!collapsed ? 1 : 0) : 0, px: 0.5 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
          borderRadius: 2,
          bgcolor: alpha(stc(title), 0.1),
        }}>
          {icon && cloneElement(icon as React.ReactElement<{ size: number }>, { size: 16, color: stc(title) })}
        </Box>
        <Typography variant="subtitle2" sx={{ lineHeight: 1 }} color="textPrimary">{title}</Typography>
        {guidance && <Typography variant="caption" sx={{ flex: 1, textAlign: 'right' }} color="textSecondary">{guidance}</Typography>}
        {uuid && <IconButton
          size="small"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand section' : 'Collapse section'}
          sx={{ ml: guidance ? 0 : 'auto', p: 0.25 }}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </IconButton>}
      </Box>}
      {!collapsed && children && <Stack sx={{ gap, px: 0.5, pb: 0.5 }} divider={divider ? <Divider /> : undefined}>
        {children}
      </Stack>}
    </Box>
  </Box>
}
