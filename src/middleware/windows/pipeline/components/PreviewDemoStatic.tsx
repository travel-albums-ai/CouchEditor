import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

type AdjustmentPreviewProps = {
  paletteItem: NodePaletteItem;
};

export function PreviewDemoStatic({ paletteItem }: AdjustmentPreviewProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const images = {
    'ai-colorizer': <img src="sample.jpg" style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />,
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

      {paletteItem.labelDescription && <Typography variant="caption" sx={{
        flex: 1,
      }} color="textSecondary">
        {t(paletteItem.labelDescription)}
      </Typography>}
    </Box>
  );
}
