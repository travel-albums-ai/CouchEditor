import { SegmentedControl, SegmentedControlItem } from '@/components/SegmentedControl';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { type Node, type NodeProps } from "@xyflow/react";
import { Maximize2 } from 'lucide-react';
import { useState } from "react";

const SCALE_PRESETS = [
  { value: "1", label: "Original" },
  { value: "0.1", label: "10%" },
  { value: "0.25", label: "25%" },
  { value: "0.5", label: "50%" },
  { value: "0.65", label: "65%" },
  { value: "0.85", label: "85%" },
  { value: "1.5", label: "150%" },
  { value: "2", label: "200%" },
];

function RescaleNode({
  data,
}: NodeProps<Node<{ scale?: number }>>) {
  const [scale, setScale] = useState(String(data.scale ?? 1));

  return (<>
    <InputHandle id="image" />
    <NodeWrapper title={'Rescale'} icon={<Maximize2 />} toolbar={<></>} type="rescale">

      <SegmentedControl
        value={scale}
        onChange={(_, value) => {
          data.scale = Number(value);
          setScale(value);

          window.dispatchEvent(
            new CustomEvent("pipeline:changed")
          );
        }}
        fullWidth
      >
        {SCALE_PRESETS.map((preset) => (
          <SegmentedControlItem key={preset.value} value={preset.value}>
            {preset.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <small>Rescales the image according to the selected preset</small>

    </NodeWrapper>
    <OutputHandle id="image" />
  </>);
}

export default RescaleNode;
