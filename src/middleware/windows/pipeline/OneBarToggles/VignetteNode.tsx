import { vignetteStage } from '@/lib/utils';
import { AdjustmentPreview } from '@/middleware/windows/pipeline/components/AdjustmentPreview';
import AdjustmentSlider from '@/middleware/windows/pipeline/components/AdjustmentSlider';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import { Box, Typography } from '@mui/material';
import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
import { useState } from 'react';

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
  const [amount, setAmount] = useState(data.amount ?? 0);
  const [color, setColor] = useState(data.color ?? DEFAULT_COLOR);

  return <>
    <InputHandle id="image" />
    <NodeWrapper
      type="vignette"
      tools={<PipelineStageTiming nodeId={id} nodeType="vignette" />}
      helper={<AdjustmentPreview amount={amount} algorithm={(value) => vignetteStage(value, color)} label="Vignette" />}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="textSecondary">Vignette color</Typography>
        <input
          aria-label="Vignette color"
          type="color"
          value={rgbToHex(color)}
          onChange={(event) => {
            const nextColor = hexToRgb(event.target.value);
            setNodes((current) => current.map((node) => node.id === id
              ? { ...node, data: { ...node.data, color: nextColor } }
              : node
            ));
            setColor(nextColor);
            emitPipelineChange();
          }}
        />
      </Box>
      <AdjustmentSlider
        min={0}
        max={100}
        step={1}
        value={amount}
        onChange={(value) => {
          setNodes((current) => current.map((node) => node.id === id
            ? { ...node, data: { ...node.data, amount: value } }
            : node
          ));
          setAmount(value);
        }}
      />
    </NodeWrapper>
    <OutputHandle id="image" />
  </>;
}
