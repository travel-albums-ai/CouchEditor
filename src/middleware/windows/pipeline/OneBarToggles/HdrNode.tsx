import { paletteItemsByType } from '@/middleware/windows/pipeline/NodePalette';
import { Typography } from '@mui/material';
import { type Node, type NodeProps, useReactFlow } from '@xyflow/react';
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
  const paletteItem = paletteItemsByType["hdr"];

  return <>
    <InputHandle id="image" />
    <NodeWrapper
      type="hdr"
      tools={<PipelineStageTiming nodeId={id} nodeType="hdr" />}
      helper={<AdjustmentPreview paletteItem={paletteItem} data={data} />}
    >
      {paletteItem.configs?.map((config, index) => (
        <AdjustmentSlider
          description={<Typography variant="caption" color="textSecondary">{config.labelKey ? config.labelKey : ""}</Typography>}
          min={config.min ?? 0}
          max={config.max ?? 100}
          throttleMs={1000}
          step={config.step ?? 1}
          value={data[config.key] ?? 0}
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
