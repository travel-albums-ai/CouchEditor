import SolidChip from '@/components/SolidChip';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
import { Box, Divider, Slider, Typography, useTheme } from '@mui/material';
import { Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';

const previewImageUrl = 'sample.jpg';

type AdjustmentPreviewProps = {
  item: NodePaletteItem;
  // amount: number;
  config: any;
  algorithm: (amount: number) => (image: ImageData) => void;
  label: string;
  labelDescription?: string;
};

export function AdjustmentPreviewDemo({ item, config, algorithm, label, labelDescription }: AdjustmentPreviewProps) {
  const [processedImageUrl, setProcessedImageUrl] = useState(previewImageUrl);
  const [amount, setAmount] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const min = typeof config?.min === 'number' ? config.min : 0;
    const max = typeof config?.max === 'number' ? config.max : 1;

    setAmount(min + (max - min) / 2);

    const intervalId = window.setInterval(() => {
      setAmount((currentAmount) => {
        const nextAmount = min + Math.random() * (max - min);

        if (nextAmount !== currentAmount || min === max) {
          return nextAmount;
        }

        return currentAmount === min ? max : min;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [config?.max, config?.min]);

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
      algorithm(amount)(imageData);
      context.putImageData(imageData, 0, 0);

      if (!cancelled) {
        setProcessedImageUrl(canvas.toDataURL('image/jpeg'));
      }
    };
    image.src = previewImageUrl;

    return () => {
      cancelled = true;
    };
  }, [algorithm, amount]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1, p: 2, justifyContent: 'center',
      opacity: 0.85,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 4,
      boxShadow: `inset 0 4px 6px rgba(0, 0, 0, 0.1)`,
      transition: 'opacity 0.25s ease',
      '&:hover': {
        opacity: 1,
      }
    }}>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <img src={previewImageUrl} alt={`${label} preview before`} style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />

        <Divider orientation="horizontal" sx={{ width: 20}} />

        {/* {Math.round(amount * 100) / 100} */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 1, boxShadow: 1  }}>
          <Cpu />
          <SolidChip label={`${Math.round(amount * 100) / 100}`} minWidth={50} borderless variant="header" />
        </Box>

        <Divider orientation="horizontal" sx={{ width: 20}} />

        <img src={processedImageUrl} alt={`${label} preview after`} style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />
      </Box>

      <Slider
        value={amount}
        min={typeof config?.min === 'number' ? config.min : 0}
        max={typeof config?.max === 'number' ? config.max : 1}
        step={config?.step ?? 0.01}
      />

      <Typography variant="body2" sx={{ mt: 2 }}>
        {labelDescription}
      </Typography>
    </Box>
  );
}
