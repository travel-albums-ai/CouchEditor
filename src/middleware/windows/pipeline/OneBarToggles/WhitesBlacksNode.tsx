import AdjustmentSlider from '@/middleware/windows/pipeline/components/AdjustmentSlider';
import { paletteItemsByType } from '@/middleware/windows/pipeline/NodePalette';
import { Typography } from '@mui/material';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import ToneNodeLayout from './ToneNodeLayout';

type WhitesBlacksData = {
  whites?: number;
  blacks?: number;
};

export default function WhitesBlacksNode({
  id,
  data,
}: NodeProps<Node<WhitesBlacksData>>) {
  const { setNodes } = useReactFlow();
  const paletteItem = paletteItemsByType["whites-blacks"];

  return (
    <ToneNodeLayout id={id} type="whites-blacks" runningConfig={data}>
      {paletteItem.configs?.map((config) => (
        <AdjustmentSlider
          description={config.labelKey ? <Typography variant="caption" color="textSecondary">{config.labelKey}</Typography> : undefined}
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
    </ToneNodeLayout>
  );
}
