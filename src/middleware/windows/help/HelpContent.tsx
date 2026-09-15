import SectionHeader from '@/components/SectionHeader';
import SidebarCoreButton from '@/components/SidebarCoreButton';
import PreviewDemo from '@/middleware/windows/pipeline/components/PreviewDemo';
import { PreviewDescription } from '@/middleware/windows/pipeline/components/PreviewDescription';
import PreviewTitle from '@/middleware/windows/pipeline/components/PreviewTitle';
import { groupedPaletteItems } from '@/middleware/windows/pipeline/NodePalette';
import { Box } from '@mui/material';
import { BookOpen, Brain, Bug, Dock, GalleryVerticalEnd, Proportions, SquareDashedText } from 'lucide-react';
import { useState } from 'react';
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

export default function HelpContent() {
  const { t } = useTranslation();
  const [activeGroup, setActiveGroup] = useState('default');

  // const sections = useMemo(() => [
  //   { key: 'layout', titleKey: 'settingsInterfaceTitle', component: <LayoutPopover />, icon: <Shapes size={16} />, guidance: t('layoutGuidance') },
  //   { key: 'performance', titleKey: 'settingsPerformanceTitle', component: <PerformanceSettings />, icon: <Turtle size={16} />, guidance: t('settingsPerformanceGuidance') },
  //   { key: 'byok', group: 'ai', titleKey: 'settingsByokTitle', component: <BYOKPopover />, icon: <Astroid size={16} />, guidance: t('settingsByokGuidance') },
  //   { key: 'costs', group: 'ai', titleKey: 'settingsByokCosts', component: <AICostsPopover />, icon: <Coins size={16} />, guidance: t('settingsByokGuidanceCosts') },
  // ], [t])

  // const groupedSections = useMemo(() => {
  //   const groups: Record<string, typeof sections> = {};
  //   sections.forEach((section) => {
  //     const group = section.group || 'default';
  //     if (!groups[group]) {
  //       groups[group] = [];
  //     }
  //     groups[group].push(section);
  //   });
  //   return groups;
  // }, [sections]);

  return (
    <>
      <SectionHeader
        sx={{ py: 2, px: 1, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', }}
        image="settings_header.png"
        bgSize="645px"
        icon={BookOpen}
        iconSize={48}
        title="Manual"
        subTitle="Learn how to use the each node feature in the pipeline effectively."
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: "100%", borderTop: '1px solid', borderColor: 'divider', pt: 2, mt: 2 }} id="settings-content">

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '0 0 250px' }}>
          {Object.entries(groupedPaletteItems).map(([groupName, _]) => (<>
            <SidebarCoreButton
              key={groupName}
              title={t(groupName)}
              icon={<SquareDashedText />}
              isActive={activeGroup === groupName}
              onClick={() => setActiveGroup(groupName)}
              noCounts={true}
            />
          </>))}
        </Box>

        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, overflow: 'auto'  }}>
          {Object.entries(groupedPaletteItems)
            .filter(([groupName, _]) => groupName === activeGroup)
            .map(([groupName, group]) => (
              <Box key={groupName} sx={{ display: 'flex', flexDirection: 'column' }}>

                <Box sx={{
                  display: 'grid',
                  alignSelf: 'stretch',

                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                  mb: 4,
                }}>
                  {group.map(paletteItem => (
                    <Box key={paletteItem.type} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{
                        borderRadius: 2,
                        border: '1px dotted',
                        borderColor: 'divider',
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 2
                      }}>

                        <PreviewDemo paletteItem={paletteItem} />
                        <PreviewTitle paletteItem={paletteItem} />
                        <PreviewDescription paletteItem={paletteItem} />


                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}


        </Box>
      </Box>
    </>
  )
}
