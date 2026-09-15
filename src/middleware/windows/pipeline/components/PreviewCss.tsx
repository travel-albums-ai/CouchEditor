import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { PreviewDescription } from '@/middleware/windows/pipeline/components/PreviewDescription';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
import { Box, useTheme } from '@mui/material';
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
    <PreviewDescription paletteItem={paletteItem} />
  </Box >;
};
