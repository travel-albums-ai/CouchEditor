import { paletteItemsByType } from '@/middleware/windows/pipeline/NodePalette';
import { Typography } from '@mui/material';
import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import { AdjustmentPreview } from '../components/AdjustmentPreview';
import AdjustmentSlider from '../components/AdjustmentSlider';
import { InputHandle } from '../components/InputHandle';
import NodeWrapper from '../components/NodeWrapper';
import { OutputHandle } from '../components/OutputHandle';
import PipelineStageTiming from '../components/PipelineStageTiming';

type HdrData = {
  amount?: number;
  radius?: number;
};

export default function HdrNode({ id, data }: NodeProps<Node<HdrData>>) {
  const { setNodes } = useReactFlow();
  const [amount, setAmount] = useState(data.amount ?? 0);
  const [radius, setRadius] = useState(data.radius ?? 12);

  const paletteItem = paletteItemsByType["hdr"];

  return <>
    <InputHandle id="image" />
    <NodeWrapper
      type="hdr"
      tools={<PipelineStageTiming nodeId={id} nodeType="hdr" />}
      helper={<AdjustmentPreview
        algorithm={(imageData) => {
          const stage = paletteItem.algo?.({ amount, radius });
          stage?.(imageData);
        }} />}
    >
      <AdjustmentSlider
        description={<Typography variant="caption" color="textSecondary">Amount</Typography>}
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
      <AdjustmentSlider
        description={<Typography variant="caption" color="textSecondary">Radius</Typography>}
        min={1}
        max={50}
        step={1}
        value={radius}
        onChange={(value) => {
          setNodes((current) => current.map((node) => node.id === id
            ? { ...node, data: { ...node.data, radius: value } }
            : node
          ));
          setRadius(value);
        }}
      />
    </NodeWrapper>
    <OutputHandle id="image" />
  </>;
}
