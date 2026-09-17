import { PreviewBeforeAfter } from '@/windows/pipeline/components/PreviewBeforeAfter';
import { NodePaletteItem } from '@/windows/pipeline/NodePalette';
import { Box, Slider, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const previewImageUrl = 'sample.jpg';

type AdjustmentPreviewProps = {
  paletteItem: NodePaletteItem;
  width?: number;
};

export function PreviewDemoMath({ paletteItem, width = 90 }: AdjustmentPreviewProps) {
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
      <Box sx={{ p: 1 }}>
        <PreviewBeforeAfter
          width={width}
          after={<img src={processedImageUrl} style={{ width: `${width}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />}
          value={amount}
        />
      </Box>

      {config?.max !== config?.min && <Slider
        disabled
        size="small"
        value={amount}
        min={typeof config?.min === 'number' ? config.min : 0}
        max={typeof config?.max === 'number' ? config.max : 1}
        step={config?.step ?? 0.01}
      />}
    </Box>
  );
}
