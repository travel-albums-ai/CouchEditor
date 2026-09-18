import SectionHeader from '@/components/SectionHeader';
import SidebarCoreButton from '@/components/SidebarCoreButton';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { groupedPaletteItems, paletteItems } from '@/pipeline/NodePalette';
import HelpItem from '@/windows/help/HelpItem';
import { Box, IconButton, Switch } from '@mui/material';
import { Astroid, BookOpen, ChevronsRight, Crop, Folder, FolderInput, FolderOutput, FolderTree, Gem, GitFork, Lightbulb, Slice, SwatchBook } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const helpIcons = {
  "pipelineGroupInput": <FolderInput />,
  "pipelineLogicInput": <GitFork />,
  "pipelineGroupTransform": <Crop />,
  "pipelineGroupLight": <Lightbulb />,
  "pipelineGroupColor": <SwatchBook />,
  "pipelineGroupDetail": <Slice />,
  "pipelineGroupEffects": <Gem />,
  "pipelineGroupAi": <Astroid />,
  "pipelineGroupOutput": <FolderOutput />,
}

export default function Help() {
  const { t } = useTranslation();
  const { setSetting } = useSettings()
  const helpIndependent = useSettingsStoreSelector((state) => state.helpIndependent)
  const [activeGroup, setActiveGroup] = useState('pipelineGroupInput');


  console.log(paletteItems)

  const nextIndependentItem = ( ) => {
    setActiveGroup(prev => {
      const currentIndex = paletteItems.findIndex(item => item.labelKey+item.groupKey === prev);
      const nextIndex = (currentIndex + 1) % paletteItems.length;
      return paletteItems[nextIndex].labelKey+paletteItems[nextIndex].groupKey;
    });
  }

  const prevIndependentItem = ( ) => {
    setActiveGroup(prev => {
      const currentIndex = paletteItems.findIndex(item => item.labelKey+item.groupKey === prev);
      const prevIndex = (currentIndex - 1 + paletteItems.length) % paletteItems.length;
      return paletteItems[prevIndex].labelKey+paletteItems[prevIndex].groupKey;
    });
  }

  return (
    <>
      <SectionHeader
        sx={{ py: 2, px: 1, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', }}
        image="manuals_header.png"
        bgSize="500px"
        bgPosition="650px center"
        icon={BookOpen}
        iconSize={64}
        title={t('helpManualTitle')}
        subTitle={t('helpManualDescription')}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, px: 1, height: "100%", overflow: 'hidden' }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: '0 0 20%', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, p: 1, justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
              <Folder size={16} />
              <Switch
                id="help-independent-switch"
                size="small"
                checked={helpIndependent}
                onChange={(e) => setSetting(prev => ({ ...prev, helpIndependent: e.target.checked }))}
              />
              <FolderTree size={16} />
            </Box>

            {helpIndependent && (
              <>
                <IconButton size="small" onClick={prevIndependentItem}>
                  <ChevronsRight size={16} style={{ transform: 'rotate(180deg)' }} />
                </IconButton>
                <IconButton size="small" onClick={nextIndependentItem} id="help-next-independent-item">
                  <ChevronsRight size={16} />
                </IconButton>
              </>
            )}
          </Box>

          {!helpIndependent && Object.entries(groupedPaletteItems).map(([groupName, _]) => (<>
            <SidebarCoreButton
              key={groupName}
              title={t(groupName).toString().charAt(0).toUpperCase() + t(groupName).toString().slice(1)}
              icon={helpIcons[groupName]}
              isActive={activeGroup === groupName}
              onClick={() => setActiveGroup(groupName)}
              noCounts={true}
            />
          </>))}
          {helpIndependent && paletteItems.map((item) => (<Box key={item.labelKey+item.groupKey} sx={{ height: '40px' }}>
            <SidebarCoreButton
              title={t(item.labelKey).toString().charAt(0).toUpperCase() + t(item.labelKey).toString().slice(1)}
              icon={item.icon}
              isActive={activeGroup === item.labelKey+item.groupKey}
              onClick={() => setActiveGroup(item.labelKey+item.groupKey)}
              noCounts={true}
            />
          </Box>))}
        </Box>

        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, overflow: 'auto'  }}>
          {!helpIndependent && Object.entries(groupedPaletteItems)
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
                    <HelpItem paletteItem={paletteItem} />
                  ))}
                </Box>
              </Box>
            ))}

          {helpIndependent && paletteItems
            .filter(item => item.labelKey+item.groupKey === activeGroup)
            .map(item => (
              <Box key={item.labelKey+item.groupKey} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <HelpItem paletteItem={item} />
              </Box>
            ))}
        </Box>
      </Box>
    </>
  )
}
