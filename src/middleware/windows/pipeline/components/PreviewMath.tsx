import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const previewImageUrl = 'sample.jpg';

type AdjustmentPreviewProps = {
  data: Record<string, any>;
  paletteItem: NodePaletteItem;
};

export function PreviewMath({ data, paletteItem }: AdjustmentPreviewProps) {
  const [processedImageUrl, setProcessedImageUrl] = useState(previewImageUrl);
  const theme = useTheme();
  const { t } = useTranslation();

  const runAlgorithm = (imageData: ImageData) => {
    const stage = paletteItem.algo?.(data);
    stage?.(imageData);
  };

  useEffect(() => {
    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext('2d');
      if (!context) return;

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      runAlgorithm(imageData);
      context.putImageData(imageData, 0, 0);

      if (!cancelled) {
        setProcessedImageUrl(canvas.toDataURL('image/jpeg'));
      }
    };
    image.src = previewImageUrl;

    return () => {
      cancelled = true;
    };
  }, [data, paletteItem]);

  return (<Box sx={{
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
      after={<img src={processedImageUrl} style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />}
      value={data ? Object.values(data)?.[0] : 0}
    />

    {paletteItem.labelDescription && <Typography variant="caption" sx={{ borderTop: '1px solid',
      borderColor: 'divider',
      flex: 1,
      p: 1,
    }} color="textSecondary">
      {t(paletteItem.labelDescription)}
    </Typography>}
  </Box>);
}
