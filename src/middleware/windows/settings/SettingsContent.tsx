import SidebarCoreButton from '@/components/SidebarCoreButton';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import AICostsPopover from '@/middleware/windows/settings/AICostsPopover';
import BYOKPopover from '@/middleware/windows/settings/BYOKPopover';
import LayoutPopover from '@/middleware/windows/settings/LayoutPopover';
import { Box, Tooltip, Typography } from '@mui/material';
import { Astroid, Brain, Bug, Dock, GalleryVerticalEnd, Info, Proportions, Shapes } from 'lucide-react';
import { cloneElement, Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const sectionsMetadata = {
  ai: {
    icon: <Brain size={16} />,
    titleKey: 'settingsAiTitle',
    guidanceKey: 'settingsAiGuidance',
  },
  features: {
    icon: <Dock size={16} />,
    titleKey: 'settingsFeaturesTitle',
    guidanceKey: 'settingsFeaturesGuidance',
  },
  default: {
    icon: <Proportions size={16} />,
    titleKey: 'settingsLayoutTitle',
    guidanceKey: 'settingsLayoutGuidance',
  },
  indexer: {
    icon: <GalleryVerticalEnd size={16} />,
    titleKey: 'settingsIndexerTitle',
    guidanceKey: 'settingsIndexerGuidance',
  },
  debug: {
    icon: <Bug size={16} />,
    titleKey: 'settingsDebugTitle',
    guidanceKey: 'settingsDebugGuidance',
  },
};

export default function SettingsContent() {
  const { t } = useTranslation()
  const { setSetting } = useSettings()
  const activeSettingsTab = useSettingsStoreSelector((state) => state.activeSettingsTab);

  const sections = useMemo(() => [
    { key: 'layout', titleKey: 'settingsInterfaceTitle', component: <LayoutPopover />, icon: <Shapes size={16} />, guidance: t('layoutGuidance') },
    { key: 'byok', group: 'ai', titleKey: 'settingsByokTitle', component: <BYOKPopover />, icon: <Astroid size={16} />, guidance: t('settingsByokGuidance') },
    { key: 'costs', group: 'ai', titleKey: 'settingsByokCosts', component: <AICostsPopover />, icon: <Astroid size={16} />, guidance: t('settingsByokGuidanceCosts') },
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
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: "100%" }} id="settings-content">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: '0 0 250px' }}>
        {Object.entries(groupedSections).map(([group, groupSections], index) => (
          <Fragment key={group}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px dotted', mt: index === 0 ? 0 : 4, borderColor: 'divider', p: 1, gap: 1, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 0, justifyContent: 'flex-start' }}>
                <Typography variant="caption" color="textDisabled" sx={{ lineHeight: 0, flex: 1 }}>{sectionsMetadata[group]?.icon}</Typography>
                <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 0, flex: 1 }}>{sectionsMetadata[group] ? t(sectionsMetadata[group].titleKey) : group}</Typography>
              </Box>
              <Tooltip title={sectionsMetadata[group] ? t(sectionsMetadata[group].guidanceKey) : ''} placement="top" arrow>
                <Info size={16} />
              </Tooltip>
            </Box>
            {groupSections.map(section => (
              <SidebarCoreButton
                key={section.key}
                title={t(section.titleKey)}
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
              <Typography variant="h5" sx={{ lineHeight: 1, flex: 1 }}> {t(section.titleKey)}</Typography>
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
