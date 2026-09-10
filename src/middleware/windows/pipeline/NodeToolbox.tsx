import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { useBYOKStoreSelector } from '@/context/byokStore';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import { groupedPaletteItems } from '@/middleware/windows/pipeline/NodePalette';
import NodeToolboxItem from '@/middleware/windows/pipeline/NodeToolboxItem';
import { Box, InputAdornment, TextField } from '@mui/material';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';


export default function NodeToolbox() {
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
      overflow: 'auto',
      p: 1,
    }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          size="small"
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
        <GeneralRegistryToolbar
          fullWidth={false}
          noGhost={true}
          group="toolbox"
        />
      </Box>

      {Object.entries(groupedPaletteItems)
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
  </>
}
