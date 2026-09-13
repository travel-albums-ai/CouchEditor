import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
import { Box, Typography, useTheme } from '@mui/material';

type AdjustmentPreviewProps = {
  paletteItem: NodePaletteItem;
};

export function PreviewDemoStatic({ paletteItem }: AdjustmentPreviewProps) {
  const theme = useTheme();

  const images = {
    'ask-ai': undefined,
    'ai-colorizer': <img src="sample.jpg" style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />,
    'ai-photo-editor': undefined,
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
      {images[paletteItem.type] && <PreviewBeforeAfter
        after={images[paletteItem.type] || <></>}
      />}

      {paletteItem.labelDescription && <Typography variant="caption" sx={{ borderTop: '1px solid',
        borderColor: 'divider',
        flex: 1,
        px: 1,
        py: 1,
      }} color="textSecondary">
        {paletteItem.labelDescription}
      </Typography>}
    </Box>
  );
}
