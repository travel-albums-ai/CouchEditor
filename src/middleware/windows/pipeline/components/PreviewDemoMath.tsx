import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
import { Box, Slider, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const previewImageUrl = 'sample.jpg';

type AdjustmentPreviewProps = {
  paletteItem: NodePaletteItem;
};

export function PreviewDemoMath({ paletteItem }: AdjustmentPreviewProps) {
  const [processedImageUrl, setProcessedImageUrl] = useState(previewImageUrl);
  const [values, setValues] = useState<Record<string, number>>({});
  const theme = useTheme();
  const { t } = useTranslation();
  const configs = paletteItem.configs || (paletteItem.config ? [paletteItem.config] : []);
  const config = configs[0];
  const amount = config ? values[config.key] ?? config.defaultValue ?? config.min : 0;


  useEffect(() => {
    const randomizeValues = () => Object.fromEntries(configs.map((currentConfig) => {
      const min = currentConfig.min;
      const max = currentConfig.max;
      const step = currentConfig.step;
      const randomValue = min === max ? min : min + Math.random() * (max - min);
      const value = step
        ? Math.round((randomValue - min) / step) * step + min
        : randomValue;

      return [currentConfig.key, Math.min(max, Math.max(min, value))];
    }));

    setValues(randomizeValues());

    const intervalId = window.setInterval(() => {
      setValues(randomizeValues());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [paletteItem.config, paletteItem.configs]);

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
      paletteItem.algo(values)(imageData);
      context.putImageData(imageData, 0, 0);

      if (!cancelled) {
        setProcessedImageUrl(canvas.toDataURL('image/jpeg'));
      }
    };
    image.src = previewImageUrl;

    return () => {
      cancelled = true;
    };
  }, [paletteItem.algo, values]);

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
      <PreviewBeforeAfter
        after={<img src={processedImageUrl} style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />}
        value={amount}
      />

      <Slider
        disabled
        size="small"
        value={amount}
        min={typeof config?.min === 'number' ? config.min : 0}
        max={typeof config?.max === 'number' ? config.max : 1}
        step={config?.step ?? 0.01}
      />

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
