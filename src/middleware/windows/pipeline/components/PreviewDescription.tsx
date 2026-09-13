import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type AdjustmentPreviewProps = {
  paletteItem: NodePaletteItem;
};

export function PreviewDescription({ paletteItem }: AdjustmentPreviewProps) {
  const { t } = useTranslation();

  return (
    <>
      {paletteItem.labelDescription && <Typography variant="caption" sx={{
        flex: 1,
        width: 300,
        px: 1,
        py: 1,
      }} color="textSecondary">
        {t(paletteItem.labelDescription)}
      </Typography>}
    </>
  );
}
