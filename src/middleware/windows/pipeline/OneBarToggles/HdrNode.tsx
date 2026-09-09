import { hdrEffectStage } from '@/lib/utils';
import { Box, Typography } from '@mui/material';
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

  return <>
    <InputHandle id="image" />
    <NodeWrapper
      type="hdr"
      tools={<PipelineStageTiming nodeId={id} nodeType="hdr" />}
      helper={<AdjustmentPreview amount={amount} algorithm={(value) => hdrEffectStage(value, radius)} label="HDR" />}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="textSecondary">Amount</Typography>
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
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="textSecondary">Radius</Typography>
        <AdjustmentSlider
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
      </Box>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>;
}
