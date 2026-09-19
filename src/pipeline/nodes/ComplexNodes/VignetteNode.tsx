import AdjustmentSlider from '@/pipeline/components/AdjustmentSlider';
import { InputHandle } from '@/pipeline/components/InputHandle';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/pipeline/components/PipelineStageTiming';
import { PreviewMath } from '@/pipeline/components/PreviewMath';
import { paletteItemsByType } from '@/pipeline/NodePalette';
import { Box, Typography } from '@mui/material';
import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

type RGB = [number, number, number];

type VignetteData = {
  amount?: number;
  color?: RGB;
};

const DEFAULT_COLOR: RGB = [0, 0, 0];

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

export default function VignetteNode({ id, data }: NodeProps<Node<VignetteData>>) {
  const { setNodes } = useReactFlow();
  const { t } = useTranslation();
  const paletteItem = paletteItemsByType["vignette"];

  return <>
    <InputHandle id="image" />
    <NodeWrapper
      type="vignette"
      tools={<PipelineStageTiming nodeId={id} nodeType="vignette" />}
      helper={<PreviewMath paletteItem={paletteItem} data={data} />}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="textSecondary">{t('pipelineVignetteColor')}</Typography>
        <input
          aria-label={t('pipelineVignetteColor')}
          type="color"
          value={rgbToHex(data.color ?? DEFAULT_COLOR)}
          onChange={(event) => {
            const nextColor = hexToRgb(event.target.value);
            setNodes((current) => current.map((node) => node.id === id
              ? { ...node, data: { ...node.data, color: nextColor } }
              : node
            ));
            emitPipelineChange();
          }}
        />
      </Box>

      {paletteItem.configs?.map((config) => (
        <AdjustmentSlider
          key={config.key}
          description={config.labelKey ? t(config.labelKey) : undefined}
          min={config.min ?? 0}
          max={config.max ?? 100}
          debounceMs={250}
          step={config.step ?? 1}
          value={typeof data[config.key as keyof VignetteData] === 'number'
            ? data[config.key as keyof VignetteData] as number
            : 0}
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
  </>;
}
