import SectionHeader from '@/components/SectionHeader';
import SidebarCoreButton from '@/components/SidebarCoreButton';
import HelpItem from '@/windows/help/HelpItem';
import { groupedPaletteItems } from '@/windows/pipeline/NodePalette';
import { Box } from '@mui/material';
import { Astroid, BookOpen, Crop, FolderInput, FolderOutput, Gem, GitFork, Lightbulb, Slice, SwatchBook } from 'lucide-react';
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
  const [activeGroup, setActiveGroup] = useState('pipelineGroupInput');

  return (
    <>
      <SectionHeader
        sx={{ py: 2, px: 1, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', }}
        image="manuals_header.png"
        bgSize="500px"
        bgPosition="650px center"
        icon={BookOpen}
        iconSize={64}
        title="Manual"
        subTitle="Learn how to use the each node feature in the pipeline effectively."
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, px: 1, height: "100%", overflow: 'hidden' }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: '0 0 20%' }}>
          {Object.entries(groupedPaletteItems).map(([groupName, _]) => (<>
            <SidebarCoreButton
              key={groupName}
              title={t(groupName).toString().charAt(0).toUpperCase() + t(groupName).toString().slice(1)}
              icon={helpIcons[groupName]}
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
                    <HelpItem paletteItem={paletteItem} />
                  ))}
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </>
  )
}
