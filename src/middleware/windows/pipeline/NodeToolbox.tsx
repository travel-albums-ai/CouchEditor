import { useBYOKStoreSelector } from '@/context/byokStore';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import ToggleToolbox from '@/middleware/tools/ActionTools/ToggleToolbox';
import ToggleToolboxShape from '@/middleware/tools/ActionTools/ToggleToolboxShape';
import { groupedPaletteItems } from '@/middleware/windows/pipeline/NodePalette';
import NodeToolboxItem from '@/middleware/windows/pipeline/NodeToolboxItem';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
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
      overflow: 'hidden',
      p: 1,
    }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography color="textPrimary" sx={{ fontWeight: 'bold', fontSize: 18, letterSpacing: -0.5, lineHeight: 1 }}>Add a node</Typography>
          <Typography variant="body2" color="textSecondary">Drag to the canvas to add it</Typography>
        </Box>
        <ToggleToolboxShape />
      </Box>
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
      </Box>

      <Box sx={{ overflow: 'auto' }}>
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
    </Box>
  </>
}
