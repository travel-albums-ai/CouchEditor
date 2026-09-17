import { NodePaletteItem } from '@/pipeline/NodePalette';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type AdjustmentPreviewProps = {
  paletteItem: NodePaletteItem;
  textAlign?: 'left' | 'center' | 'right';
};

export function PreviewDescription({ paletteItem, textAlign }: AdjustmentPreviewProps) {
  const { t } = useTranslation();

  return (
    <>
      {paletteItem.labelDescription && <Typography variant="caption" sx={{
        flex: 1,
        width: 300,
        px: 1,
        py: 1,
        textAlign: textAlign ?? 'left',
      }} color="textSecondary">
        {t(paletteItem.labelDescription)}
      </Typography>}
    </>
  );
}
