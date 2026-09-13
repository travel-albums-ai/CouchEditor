import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { PreviewDescription } from '@/middleware/windows/pipeline/components/PreviewDescription';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
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

  // const images = {
  //   'ai-colorizer': <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
  //   'rescale': <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
  // }
  const imagesPairs = {
    'source': {
      before: <Box sx={{ p: 2, py: 1, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Folder color={theme.palette.primary.main} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    'hot-folder-read': {
      before: <Box sx={{ p: 2, py: 1, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Eye color={theme.palette.primary.main} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    'google-drive': {
      before: <Box sx={{ p: 2, py: 1, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Cloud color={theme.palette.primary.main} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },

    'ai-colorizer': {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, filter: 'grayscale(100%)' }} />,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    'rescale': {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
  }

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
