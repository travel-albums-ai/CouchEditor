import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import SettingsSection from '@/components/SettingsSection';
import { toolRegistry } from '@/discovery/toolRegistry';
import { Box, Typography } from '@mui/material';
import { Bug } from 'lucide-react';

export default function ToolsPopover() {
  const tools = toolRegistry.all()
  const toolIds = [...new Set(tools.map((tool) => tool.tool?.flatMap((item) => item.id)).flat().filter(Boolean) as string[])]

  return <>
    <SettingsSection title="Debug Tools" icon={<Bug />}>
      {toolIds.map((toolId) => {
        const tool = tools.find((tool) => tool.tool?.some((item) => item.id === toolId))
        if (!tool) {
          return null
        }

        return <Box key={toolId} sx={{ display: 'flex', pointerEvents: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: 1, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
          <Typography variant="caption" color="textSecondary">{toolId}</Typography>
          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <GeneralRegistryToolbar group={toolId} context={{ sidebarSearchOpen: false }} />
          </Box>
        </Box>
      })}

    </SettingsSection>

  </>
}
