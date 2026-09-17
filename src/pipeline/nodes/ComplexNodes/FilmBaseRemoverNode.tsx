import AdjustmentSlider from '@/pipeline/components/AdjustmentSlider';
import { InputHandle } from '@/pipeline/components/InputHandle';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/pipeline/components/PipelineStageTiming';
import { PreviewMath } from '@/pipeline/components/PreviewMath';
import { paletteItemsByType } from '@/pipeline/NodePalette';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type RGB = [number, number, number];

type FilmBaseRemoverData = {
  maskColor?: RGB;
  strength?: number;
  densityCompensation?: number;
  filmAge?: number;
  autoDetectBase?: boolean;
};

const DEFAULT_MASK_COLOR: RGB = [255, 128, 48];
const DEFAULT_STRENGTH = 100;

function rgbToHex([red, green, blue]: RGB) {
  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
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
  requestAnimationFrame(() => {
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  });
}

export default function FilmBaseRemoverNode({ id, data }: NodeProps<Node<FilmBaseRemoverData>>) {
  const { t } = useTranslation();
  const { setNodes } = useReactFlow();
  const paletteItem = paletteItemsByType['film-base-remover'];
  const [maskColor, setMaskColor] = useState(data.maskColor ?? DEFAULT_MASK_COLOR);
  const strength = data.strength ?? DEFAULT_STRENGTH;
  const autoDetectBase = data.autoDetectBase ?? false;

  const updateMaskColor = (value: string) => {
    const nextColor = hexToRgb(value);
    setMaskColor(nextColor);
    setNodes((current) => current.map((node) => node.id === id
      ? { ...node, data: { ...node.data, maskColor: nextColor } }
      : node
    ));
    emitPipelineChange();
  };

  return (
    <>
      <InputHandle id="image" />
      <NodeWrapper
        type="film-base-remover"
        tools={<PipelineStageTiming nodeId={id} nodeType="film-base-remover" />}
        helper={<PreviewMath paletteItem={paletteItem} data={{ ...data, maskColor, strength }} />}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="textSecondary">{t('pipelineFilmBaseMaskColor')}</Typography>
          <input
            aria-label={t('pipelineFilmBaseMaskColor')}
            type="color"
            disabled={autoDetectBase}
            value={rgbToHex(maskColor)}
            onChange={(event) => updateMaskColor(event.target.value)}
          />
        </Box>
        <FormControlLabel
          control={<Switch
            size="small"
            checked={autoDetectBase}
            onChange={(_, checked) => {
              setNodes((current) => current.map((node) => node.id === id
                ? { ...node, data: { ...node.data, autoDetectBase: checked } }
                : node
              ));
              emitPipelineChange();
            }}
          />}
          label={t('pipelineFilmBaseAutoDetect')}
        />
        {paletteItem.configs?.map((config) => (
          <AdjustmentSlider
            key={config.key}
            description={config.labelKey ? t(config.labelKey) : undefined}
            min={config.min}
            max={config.max}
            step={config.step ?? 1}
            throttleMs={1000}
            value={typeof data[config.key as keyof FilmBaseRemoverData] === 'number'
              ? data[config.key as keyof FilmBaseRemoverData] as number
              : config.defaultValue ?? 0}
            onChange={(value) => {
              setNodes((current) => current.map((node) => node.id === id
                ? { ...node, data: { ...node.data, [config.key]: value } }
                : node
              ));
            }}
          />
        ))}
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}
