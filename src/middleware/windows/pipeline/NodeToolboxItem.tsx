import { useBYOKStoreSelector } from '@/context/byokStore';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import NodeHeader from '@/middleware/windows/pipeline/components/NodeHeader';
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ mb: 0.5, textTransform: 'uppercase', fontWeight: 'bold' }} color="textDisabled">
          {t(group)}
        </Typography>
        {!isSearching && <Box
          component="span"
          sx={{ cursor: 'pointer', ml: 1, color: 'text.disabled' }}
          onClick={() => setState((prev) => ({
            ...prev,
            collapsedToolboxGroups: {
              ...prev.collapsedToolboxGroups,
              [group]: !collapse,
            },
          }))}
        >
          {collapse
            ? <ChevronDown size={16} style={{ color: 'inherit', }} />
            : <ChevronDown style={{ transform: 'rotate(180deg)', opacity: 0.5, color: 'inherit' }} size={16}  />}
        </Box>}
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
            <Tooltip title={t('pipelineDragToAdd', { label: t(item.labelKey) })} key={item.type} arrow placement={i % 2 !== 0 ? "right" : "left"}>
              <Box
                key={item.type}
                draggable
                onDragStart={(event) =>
                  onDragStart(event, item.type)
                }
              >
                <NodeHeader
                  type={item.type}
                />
              </Box>
            </Tooltip>
          ))}
      </Box>}
    </Box>
  </>
}
