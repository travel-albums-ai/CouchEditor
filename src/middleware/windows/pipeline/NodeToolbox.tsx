import SectionHeader from '@/components/SectionHeader';
import { useBYOKStoreSelector } from '@/context/byokStore';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import ToggleToolbox from '@/middleware/tools/ToggleToolbox';
import ToggleToolboxShape from '@/middleware/tools/ToggleToolboxShape';
import { groupedPaletteItems } from '@/middleware/windows/pipeline/NodePalette';
import NodeToolboxItem from '@/middleware/windows/pipeline/NodeToolboxItem';
import { Box, InputAdornment, TextField } from '@mui/material';
import { GripVertical, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NodeToolbox({ onlyGroup }: { onlyGroup?: string }) {
  const enableAI  = useBYOKStoreSelector((state) => state.enableAI)
  const searchTermToolbox = usePipelineStoreSelector((state) => state.searchTermToolbox)
  const { setState } = usePipelineStore()
  const { t } = useTranslation();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      nodeType
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return <>
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      m: 1,
      my: 1.5,
      borderRadius: 2,
      overflow: 'hidden',
      p: 1,
    }}>
      <SectionHeader
        sx={{ m: 0, p: 0, mb: 2, py: 2 }}
        image="header_toolbox.png"
        bgSize="305px"
        icon={GripVertical}
        iconSize={32}
        title="Add a node"
        subTitle="Drag to the canvas to add it"
      />

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder={t('searchToolbox')}
          value={searchTermToolbox}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            },
          }}
          onChange={(e) => setState((prev) => ({ ...prev, searchTermToolbox: e.target.value }))}
        />
        <ToggleToolbox />
        <ToggleToolboxShape />
      </Box>

      <Box sx={{ overflow: 'auto' }}>
        {Object.entries(groupedPaletteItems)
          .filter(([group, items]) => !onlyGroup || group === onlyGroup)
          .filter(([_, items]) => items.some(item => t(item.labelKey).toLowerCase().includes(searchTermToolbox.toLowerCase())))
          .filter(([_, items]) => enableAI || !items.every(item => item.ai))
          .map(([group, items]) => <NodeToolboxItem
            key={group}
            group={group}
            items={items}
            isSearching={searchTermToolbox.length > 0}
            onDragStart={onDragStart}
          />)}
      </Box>
    </Box>
  </>
}
