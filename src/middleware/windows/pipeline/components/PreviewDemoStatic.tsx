import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { PreviewDescription } from '@/middleware/windows/pipeline/components/PreviewDescription';
import { NodePaletteItem, NodeType } from '@/middleware/windows/pipeline/NodePalette';
import { Box, useTheme } from '@mui/material';
import { Cloud, Eye, Folder } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type AdjustmentPreviewProps = {
  paletteItem: NodePaletteItem;
  width?: number;
};

export function PreviewDemoStatic({ paletteItem, width }: AdjustmentPreviewProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const imagesPairs = {
    [NodeType.Source]: {
      before: <Box sx={{ p: 2, py: 1, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Folder color={theme.palette.primary.main} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.HotFolderRead]: {
      before: <Box sx={{ p: 2, py: 1, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Eye color={theme.palette.primary.main} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.GoogleDrive]: {
      before: <Box sx={{ p: 2, py: 1, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Cloud color={theme.palette.primary.main} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },

    [NodeType.SelectedPhoto]: {
      before: <Box sx={{ display: 'flex', gap: 1 }}>
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
        <img src="sample2.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.AiColorizer]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, filter: 'grayscale(100%)' }} />,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.Rescale]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
  } as Record<NodeType, { before: React.ReactNode; after: React.ReactNode }>

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 0.5,
      p: 1,
      justifyContent: 'center',
      transition: 'opacity 0.25s ease',
      '&:hover': {
        opacity: 1,
      }
    }}>
      {imagesPairs[paletteItem.type] && <Box sx={{ p: 1 }}>
        <PreviewBeforeAfter
          width={width ?? 90}
          after={imagesPairs[paletteItem.type].after || <></>}
          before={imagesPairs[paletteItem.type].before || <></>}
        />
      </Box>}

      <PreviewDescription paletteItem={paletteItem} />
    </Box>
  );
}
