import KeyboardChip from '@/components/KeyboardChip';
import { Box, Divider, Tooltip, Typography } from '@mui/material';
import { useHotkeyRegistrations } from '@tanstack/react-hotkeys';
import { Info, SquareAsterisk } from 'lucide-react';
import { cloneElement } from 'react';

export default function KeyboardList() {
  const { hotkeys } = useHotkeyRegistrations()

  const groupedHotkeys = hotkeys.reduce((acc, reg) => {
    const group = reg.options.meta?.group || 'Ungrouped'
    if (!acc[group]) acc[group] = []
    acc[group].push(reg)
    return acc
  }, {} as Record<string, typeof hotkeys>)

  return (<>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>

      { Object.entries(groupedHotkeys).map(([group, regs], index) => (
        <Box key={group} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SquareAsterisk size={14} color="gray" />
            <Typography variant="subtitle2" color="textPrimary" sx={{ fontWeight: 'bold' }}>{group}</Typography>
          </Box>
          {regs.map((reg) => (
            <Box key={reg.id}  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {reg.options.meta?.icon && cloneElement(reg.options.meta.icon, { size: 14 })}
                <Typography variant="subtitle2" color="textSecondary">{reg.options.meta?.name}</Typography>
                <Tooltip title={reg.options.meta?.description} placement="top" arrow>
                  <Info size={14} color="gray" />
                </Tooltip>
              </Box>
              <KeyboardChip shortcut={reg.hotkey.toString()} />
            </Box>
          ))}
          {index < Object.entries(groupedHotkeys).length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  </>)
}
