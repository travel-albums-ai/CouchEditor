import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
import { Box, Slider, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

type AdjustmentPreviewProps = {
  paletteItem: NodePaletteItem;
};

export function PreviewDemoCss({ paletteItem }: AdjustmentPreviewProps) {
  const [amount, setAmount] = useState(0);
  const theme = useTheme();
  const config = paletteItem.configs?.[0] || paletteItem.config;


  useEffect(() => {
    const min = typeof config?.min === 'number' ? config.min : 0;
    const max = typeof config?.max === 'number' ? config.max : 1;

    if (min === max) {
      return;
    }

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

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.5,
      p: 2,
      justifyContent: 'center',
      transition: 'opacity 0.25s ease',
      '&:hover': {
        opacity: 1,
      }
    }}>
      <PreviewBeforeAfter
        after={<img src="sample.jpg" style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}`, ...paletteItem.algo({ amount }) }} />}
        value={amount}
      />

      {config?.min !== config?.max && (
        <Slider
          disabled
          size="small"
          value={amount}
          min={typeof config?.min === 'number' ? config.min : 0}
          max={typeof config?.max === 'number' ? config.max : 1}
          step={config?.step ?? 0.01}
        />
      )}

      {paletteItem.labelDescription && <Typography variant="caption" sx={{ boxShadow: `inset 0 4px 6px rgba(0, 0, 0, 0.1)`, px: 1, py: 1, borderRadius: 2 }} color="textSecondary">
        {paletteItem.labelDescription}
      </Typography>}
    </Box>
  );
}
