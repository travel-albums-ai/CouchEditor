import AdjustmentSlider from '@/middleware/windows/pipeline/components/AdjustmentSlider';
import { Box, Typography } from '@mui/material';
import { type Node, type NodeProps } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToneNodeLayout from './ToneNodeLayout';

type RGB = [number, number, number];

type SplitToningData = {
  shadowTint?: RGB;
  highlightTint?: RGB;
  strength?: number;
};

const DEFAULT_SHADOW_TINT: RGB = [48, 64, 96];
const DEFAULT_HIGHLIGHT_TINT: RGB = [255, 224, 176];

function rgbToHex([red, green, blue]: RGB) {
  return `#${[red, green, blue]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

function hexToRgb(value: string): RGB {
  const hex = value.slice(1);
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

function emitPipelineChange() {
  window.dispatchEvent(new CustomEvent('pipeline:changed'));
}

export default function SplitToningNode({
  id,
  data,
}: NodeProps<Node<SplitToningData>>) {
  const { t } = useTranslation();
  const [shadowTint, setShadowTint] = useState(
    data.shadowTint ?? DEFAULT_SHADOW_TINT
  );
  const [highlightTint, setHighlightTint] = useState(
    data.highlightTint ?? DEFAULT_HIGHLIGHT_TINT
  );
  const [strength, setStrength] = useState(data.strength ?? 50);

  const updateTint = (key: 'shadowTint' | 'highlightTint', value: string) => {
    const next = hexToRgb(value);
    Object.assign(data, { [key]: next });

    if (key === 'shadowTint') {
      setShadowTint(next);
    } else {
      setHighlightTint(next);
    }

    emitPipelineChange();
  };

  return (
    <ToneNodeLayout id={id} type="split-toning">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="textSecondary">{t('pipelineShadowTint')}</Typography>
        <input
          aria-label={t('pipelineShadowTint')}
          type="color"
          value={rgbToHex(shadowTint)}
          onChange={(event) => updateTint('shadowTint', event.target.value)}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="textSecondary">{t('pipelineHighlightTint')}</Typography>
        <input
          aria-label={t('pipelineHighlightTint')}
          type="color"
          value={rgbToHex(highlightTint)}
          onChange={(event) => updateTint('highlightTint', event.target.value)}
        />
      </Box>

      <AdjustmentSlider
        description={<Typography variant="caption" color="textSecondary">
          {t('pipelineSplitToningStrength')}
        </Typography>}
        min={0}
        max={100}
        step={1}
        value={strength}
        onChange={(value) => {
          Object.assign(data, { strength: value });
          setStrength(value);
        }}
      />
    </ToneNodeLayout>
  );
}
