import SolidChip from '@/components/SolidChip';
import { useBYOKStoreSelector } from '@/context/byokStore';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import NodeToolboxHeader from '@/middleware/windows/pipeline/components/NodeToolboxHeader';
import { PreviewDemoCss } from '@/middleware/windows/pipeline/components/PreviewDemoCss';
import { PreviewDemoMath } from '@/middleware/windows/pipeline/components/PreviewDemoMath';
import { PreviewDemoStatic } from '@/middleware/windows/pipeline/components/PreviewDemoStatic';
import { Box, Tooltip, Typography } from '@mui/material';
import { ChevronDown, Info, Pointer } from 'lucide-react';
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
        gridTemplateColumns: 'repeat(2, 440px)',
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
              {/* {item.processing === 'css' && <PreviewDemoCss paletteItem={item} />} */}
              {/* {item.processing === 'math' && <PreviewDemoMath paletteItem={item} />} */}
              {item.processing === 'css' && <PreviewDemoCss paletteItem={item} />}
              {item.processing === 'static' && <PreviewDemoStatic paletteItem={item} />}
              {item.processing === 'math' && <PreviewDemoMath paletteItem={item} />}

              <NodeToolboxHeader type={item.type}>
                <Tooltip title={<Box>
                  <Box sx={{ mx: 1, mb: 2, mt: 1 }}>
                    <SolidChip label={t('pipelineDragToAdd', { label: t(item.labelKey) })} borderless variant="header" icon={<Pointer />} />
                  </Box>

                  {item.processing === 'css' && <PreviewDemoCss paletteItem={item} />}
                  {item.processing === 'math' && <PreviewDemoMath paletteItem={item} />}

                </Box>} key={item.type} arrow placement="left">
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
