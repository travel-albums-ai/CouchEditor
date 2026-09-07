import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SidebarCoreButton from '@/middleware/interface/sidebar/SidebarCoreButton';
import BYOKPopover from '@/middleware/windows/settings/BYOKPopover';
import DrawersPopover from '@/middleware/windows/settings/DrawersPopover';
import FilterPhotosPopover from '@/middleware/windows/settings/FilterPhotosPopover';
import IndexerPopover from '@/middleware/windows/settings/IndexerPopover';
import LayoutPopover from '@/middleware/windows/settings/LayoutPopover';
import MCPPopover from '@/middleware/windows/settings/MCPPopover';
import SectionsPopover from '@/middleware/windows/settings/SectionsPopover';
import TagsPopover from '@/middleware/windows/settings/TagsPopover';
import ToolsPopover from '@/middleware/windows/settings/ToolsPopover';
import { Box, Tooltip, Typography } from '@mui/material';
import { Astroid, Brain, Bug, Dock, GalleryVerticalEnd, Group, Info, ListFilter, PanelsRightBottom, Proportions, Server, Shapes, Tag } from 'lucide-react';
import { cloneElement, Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const sectionsMetadata = {
  ai: {
    icon: <Brain size={16} />,
    title: 'AI',
    guidance: 'Configure AI features and personas',
  },
  features: {
    icon: <Dock size={16} />,
    title: 'Features',
    guidance: 'Manage application features and settings',
  },
  default: {
    icon: <Proportions size={16} />,
    title: 'Layout',
    guidance: 'Customize the layout of the application',
  },
  indexer: {
    icon: <GalleryVerticalEnd size={16} />,
    title: 'Indexer',
    guidance: 'Configure the indexer settings and behavior',
  },
  debug: {
    icon: <Bug size={16} />,
    title: 'Debug',
    guidance: 'Review debug settings and behavior',
  },
};

export default function SettingsContent() {
  const { t } = useTranslation()
  const { setSetting } = useSettings()
  const activeSettingsTab = useSettingsStoreSelector((state) => state.activeSettingsTab);

  const sections = useMemo(() => [
    { key: 'layout', title: "Interface", component: <LayoutPopover />, icon: <Shapes size={16} />, guidance: t('layoutGuidance') },
    { key: 'tools', group: 'debug', title: "Toolbars", component: <ToolsPopover />, icon: <Dock size={16} />, guidance: "Organize and manage tools in the application" },
    { key: 'filterPhotos', group: 'features', title: t('filterPhotos'), component: <FilterPhotosPopover />, icon: <ListFilter size={16} />, guidance: t('filterPhotosGuidance') },
    { key: 'drawers', group: 'features', title: 'Windows', component: <DrawersPopover />, icon: <PanelsRightBottom size={16} />, guidance: 'Hide/Show various drawers in the application' },
    { key: 'byok', group: 'ai', title: 'BYOK & AI', component: <BYOKPopover />, icon: <Astroid size={16} />, guidance: 'Set BYOK keys to use AI enhanced features' },
    { key: 'mcp', group: 'ai', title: 'WebMCP', component: <MCPPopover />, icon: <Astroid size={16} />, guidance: 'Give AI access to your data via WebMCP' },
    { key: 'indexer', group: 'indexer', title: t('indexer'), component: <IndexerPopover />, icon: <Server size={16} />, guidance: t('indexerGuidance') },
    { key: 'sections', group: 'features', title: 'Explorer', component: <SectionsPopover />, icon:  <Group size={16} />, guidance: t('sectionsGuidance') },
    { key: 'tags', group: 'features', title: t('tags'), component: <TagsPopover />, icon:  <Tag size={16} />, guidance: t('tagsGuidance') },
  ], [t])

  useEffect(() => {
    if (!activeSettingsTab && sections.length > 0) {
      setSetting((prev) => ({ ...prev, activeSettingsTab: sections[0].key }))

    }
  }, [activeSettingsTab, sections, setSetting]);

  const groupedSections = useMemo(() => {
    const groups: Record<string, typeof sections> = {};
    sections.forEach((section) => {
      const group = section.group || 'default';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(section);
    });
    return groups;
  }, [sections]);

  return (<>
    <WebMCPDataRun
      name="toggle_settings_section"
      description="Toggle the active settings section."
      inputSchema={{
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            enum: ['layout', 'indexer', 'sections', 'demo', 'tags'],
            description: 'Settings section to switch to.',
          },
        },
        required: ['mode'],
        additionalProperties: false,
      }}
      execute={async ({ mode }: { mode: 'layout' | 'indexer' | 'sections' | 'demo' | 'tags' }) => {
        setSetting((prev) => ({
          ...prev,
          activeSettingsTab: mode,
        }));

        return {
          content: [
            {
              type: 'text',
              text: `Settings section switched to ${mode}.`,
            },
          ],
        };
      }}
      deps={[activeSettingsTab, setSetting]}
    />

    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: "100%" }} id="settings-content">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: '0 0 250px' }}>
        {Object.entries(groupedSections).map(([group, groupSections], index) => (
          <Fragment key={group}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted', mt: index === 0 ? 0 : 4, borderColor: 'divider', p: 1, gap: 1, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 0, justifyContent: 'flex-start' }}>
                <Typography variant="caption" color="textDisabled" sx={{ lineHeight: 0, flex: 1 }}>{sectionsMetadata[group]?.icon}</Typography>
                <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 0, flex: 1 }}>{sectionsMetadata[group]?.title || group}</Typography>
              </Box>
              <Tooltip title={sectionsMetadata[group]?.guidance || ''} placement="top" arrow>
                <Info size={16} />
              </Tooltip>
            </Box>
            {groupSections.map(section => (
              <SidebarCoreButton
                key={section.key}
                title={section.title}
                icon={section.icon}
                isActive={activeSettingsTab === section.key}
                onClick={() => setSetting((prev) => ({ ...prev, activeSettingsTab: section.key }))}
                noCounts={true}
              />
            ))}
          </Fragment>
        ))}
      </Box>

      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, overflow: 'auto'  }}>
        {sections
          .filter(section => section.key === activeSettingsTab)
          .map(section => (<Fragment key={section.key}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'space-between' }}>
              {section.icon && cloneElement(section.icon, { size: 24 })}
              <Typography variant="h5" sx={{ lineHeight: 1, flex: 1 }}> {section.title}</Typography>
              { section.guidance && <Typography variant="body2" color="textDisabled">{section.guidance}</Typography> }
            </Box>
            <Box key={section.key} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {section.component}
            </Box>
          </Fragment>))}
      </Box>
    </Box>
  </>)
}
