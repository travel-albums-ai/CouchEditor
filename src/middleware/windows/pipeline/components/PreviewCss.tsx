import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function PreviewCss({ image2style, data, paletteItem }: { image2style: React.CSSProperties, data: Record<string, any>, paletteItem: NodePaletteItem }) {
  const theme = useTheme();
  const { t } = useTranslation();

  return  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 2,
    pt: 1,
    width: '300px',
    justifyContent: 'center',
    transition: 'opacity 0.25s ease',
    '&:hover': {
      opacity: 1,
    }
  }}>
    <PreviewBeforeAfter
      after={<img src="sample.jpg" style={{ maxWidth: '90px', borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, ...image2style }} />}
      value={data ? Object.values(data)?.[0] : 0}
    />

    {paletteItem.labelDescription && <Typography variant="caption" sx={{ borderTop: '1px solid',
      borderColor: 'divider',
      flex: 1,
      px: 1,
      py: 1,
    }} color="textSecondary">
      {t(paletteItem.labelDescription)}
    </Typography>}
  </Box >;
};
