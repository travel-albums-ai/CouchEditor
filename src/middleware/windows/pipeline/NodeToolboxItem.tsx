import { useBYOKStoreSelector } from '@/context/byokStore';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import { highlightsStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/components/AdjustmentPreview';
import NodeToolboxHeader from '@/middleware/windows/pipeline/components/NodeToolboxHeader';
import { Box, Tooltip, Typography } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NodeToolboxItem({ group, items, onDragStart, isSearching } : { group: string, items: any[], onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void, isSearching: boolean }) {
  const enableAI  = useBYOKStoreSelector((state) => state.enableAI)
  const searchTermToolbox = usePipelineStoreSelector((state) => state.searchTermToolbox)
  const collapse = usePipelineStoreSelector((state) => state.collapsedToolboxGroups[group] ?? false)
  const { setState } = usePipelineStore()
  const { t } = useTranslation();

  return <>
    <Box
      sx={{
        display: 'flex', flexDirection: 'column', gap: 0
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 0.5, mb: 0.5 }} onClick={() => setState((prev) => ({
        ...prev,
        collapsedToolboxGroups: {
          ...prev.collapsedToolboxGroups,
          [group]: !collapse,
        },
      }))}>
        {!isSearching && <Box
          component="span"
          sx={{ cursor: 'pointer', color: 'text.secondary',  lineHeight: 0 }}

        >
          {!collapse
            ? <ChevronDown size={16} style={{ color: 'inherit', lineHeight: 0 }} />
            : <ChevronDown style={{ transform: 'rotate(180deg)', opacity: 1, lineHeight: 0, color: 'inherit' }} size={16}  />}
        </Box>}
        <Typography variant="caption" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }} color="textPrimary">
          {t(group)}
        </Typography>
      </Box>

      {(isSearching || !collapse) && <Box sx={{
        display: 'grid',
        alignContent: 'start',
        mb: 2,
        gridTemplateColumns: 'repeat(2, 140px)',
        gap: 1,
      }}>
        {items
          .filter(item => t(item.labelKey).toLowerCase().includes(searchTermToolbox.toLowerCase()))
          .filter(item => enableAI || item.ai === undefined)
          .map((item, i) => (
            <Tooltip title={<>
              {t('pipelineDragToAdd', { label: t(item.labelKey) })}
              <AdjustmentPreview amount={80} algorithm={highlightsStage} label="Highlights" />
            </>} key={item.type} arrow placement="top">
              <Box
                key={item.type}
                draggable
                onDragStart={(event) =>
                  onDragStart(event, item.type)
                }
              >
                <NodeToolboxHeader
                  type={item.type}
                />
              </Box>
            </Tooltip>
          ))}
      </Box>}
    </Box>
  </>
}
