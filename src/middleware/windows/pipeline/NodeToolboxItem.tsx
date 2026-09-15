import { useBYOKStoreSelector } from '@/context/byokStore';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import NodeToolboxHeader from '@/middleware/windows/pipeline/components/NodeToolboxHeader';
import PreviewDemo from '@/middleware/windows/pipeline/components/PreviewDemo';
import { PreviewDescription } from '@/middleware/windows/pipeline/components/PreviewDescription';
import PreviewTitle from '@/middleware/windows/pipeline/components/PreviewTitle';
import { Box, Chip, Tooltip, Typography, useTheme } from '@mui/material';
import { ChevronDown, Info, Pointer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NodeToolboxItem({ group, items, onDragStart, isSearching } : { group: string, items: any[], onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void, isSearching: boolean }) {
  const enableAI  = useBYOKStoreSelector((state) => state.enableAI)
  const searchTermToolbox = usePipelineStoreSelector((state) => state.searchTermToolbox)
  const collapse = usePipelineStoreSelector((state) => state.collapsedToolboxGroups[group] ?? false)
  const { setState } = usePipelineStore()
  const { t } = useTranslation();
  const theme = useTheme();

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
        gridTemplateColumns: 'repeat(2, 175px)',
        gap: 1,
      }}>
        {items
          .filter(item => t(item.labelKey).toLowerCase().includes(searchTermToolbox.toLowerCase()))
          .filter(item => enableAI || item.ai === undefined)
          .map((item, i) => (
            <Box
              key={item.type}
              draggable
              onDragStart={(event) =>
                onDragStart(event, item.type)
              }
            >

              <NodeToolboxHeader type={item.type}>
                <Tooltip title={<Box sx={{ bgcolor: 'background.paper' }}>
                  <PreviewTitle paletteItem={item} />
                  <PreviewDescription paletteItem={item} />

                  <Box sx={{
                    boxShadow: theme => `inset 0 0 4px 0px ${theme.palette.divider}`,
                    borderRadius: 2,
                    my: 1,
                    p: 0 }}>
                    <PreviewDemo paletteItem={item} />
                  </Box>

                  <Box sx={{ mx: 1, py: 2, display: 'flex', justifyContent: 'center' }}>
                    <Chip label={t('pipelineDragToAdd', { label: t(item.labelKey) })} icon={<Pointer size={16} />} size="small" variant="outlined" sx={{ py: 1.5, px: 1, fontSize: 12 }} color="primary" />
                  </Box>

                </Box>} key={item.type} arrow placement="right">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Info size={16} style={{ color: 'inherit', opacity: 0.15, lineHeight: 0 }} />
                  </span>
                </Tooltip>
              </NodeToolboxHeader>
            </Box>
          ))}
      </Box>}
    </Box>
  </>
}
