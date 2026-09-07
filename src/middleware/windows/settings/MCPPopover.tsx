import PopoverButtonSimple from '@/components/PopoverButtonSimple';
import SettingsSection from '@/components/SettingsSection';
import SolidChip from '@/components/SolidChip';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import SettingToggleRow from '@/middleware/windows/settings/components/SettingToggleRow';
import { Box, Typography } from '@mui/material';
import { Code, Cog, Eye } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'webMcp', labelKey: 'useWebMcp', type: 'boolean' },
] as const

export default function MCPPopover() {
  const { getRegisteredTools, setSetting } = useBYOK()
  const byokStore = useBYOKStoreSelector((state) => state)
  const registeredTools = getRegisteredTools();
  const { t } = useTranslation()
  const webMcpEnabled = byokStore.webMcp || false;

  return <>
    <SettingsSection title="Use WebMCP" icon={<Cog />}>
      {toggleControls
        .map((control) => (
          <Fragment key={control.key}>
            {control.type === 'boolean' && <SettingToggleRow
              key={control.key}
              label={t(control.labelKey)}
              selected={byokStore[control.key] || false}
              onChange={() => setSetting((prev) => ({ ...prev, [control.key]: !byokStore[control.key] }))}

            />}

          </Fragment>
        ))}
    </SettingsSection>

    <SettingsSection title="View Tools" icon={<Eye />} uuid="mcp-view-tools">
      {registeredTools
        .filter(tool => tool.type === 'view')
        .map((tool) => (
          <Box key={tool.name} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Typography sx={{ flex: 1, textDecoration: webMcpEnabled ? 'none' : 'line-through' }} variant="body2" color={webMcpEnabled ? 'textSecondary' : 'textDisabled'}>{tool.description}</Typography>
            <SolidChip label={tool.name} />
          </Box>
        ))}
    </SettingsSection>

    <SettingsSection title="Run Tools" icon={<Cog />} uuid="mcp-run-tools">
      {registeredTools
        .filter(tool => tool.type === 'run')
        .map((tool) => (
          <Box key={tool.name} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
            <Typography sx={{ flex: 1, textDecoration: webMcpEnabled ? 'none' : 'line-through' }} variant="body2" color={webMcpEnabled ? 'textSecondary' : 'textDisabled'}>{tool.description}</Typography>
            <PopoverButtonSimple trigger={<Code size={16} />}>
              <pre>{JSON.stringify(tool.inputSchema, null, 2)}</pre>
            </PopoverButtonSimple>
            <SolidChip label={tool.name} />
          </Box>
        ))}
    </SettingsSection>
  </>
}
