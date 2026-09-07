import SolidChip from '@/components/SolidChip';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Box, Slider } from '@mui/material';
import { type Node, type NodeProps } from "@xyflow/react";
import { JSX, useState } from "react";

export type SliderNodeConfig = {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  type: string;
  label?: string;
  icon?: JSX.Element;
  info?: (config: SliderNodeConfig & { amount: number }) => JSX.Element;
};

// Builds a single-slider node component sharing the same
// data.amount + "pipeline:changed" wiring as BrightnessNode.
export function createSliderNode(config: SliderNodeConfig) {
  function SliderNode({
    data,
  }: NodeProps<Node<{ amount?: number }>>) {
    const [amount, setAmount] = useState(
      data.amount ?? config.defaultValue
    );

    return <>
      <InputHandle id="image" />
      <NodeWrapper title={config.label ?? config.type} icon={config.icon} type={config.type} helper={config.info && config.info({...config, amount })}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Slider
            min={config.min}
            max={config.max}
            step={config.step}
            sx={{ width: '150px', mx: 1 }}
            value={amount}
            onChange={(event, value) => {
              const newValue = Array.isArray(value) ? value[0] : value;

              data.amount = newValue;
              setAmount(newValue);

              // Tell the pipeline engine that this node changed.
              window.dispatchEvent(
                new CustomEvent("pipeline:changed")
              );
            }}
          />
          <SolidChip count={amount} />
        </Box>

      </NodeWrapper>
      <OutputHandle id="image" />
    </>;
  }

  return SliderNode;
}
