import SolidChip from '@/components/SolidChip';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { Box } from '@mui/material';
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

      {/* <SettingsSection title={config.label} icon={<span>{config.icon}</span>} tint={config.label}> */}
      <NodeWrapper title={config.label ?? config.type} icon={config.icon} type={config.type}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={amount}
            onChange={(event) => {
              const value = Number(event.target.value);

              data.amount = value;
              setAmount(value);

              // Tell the pipeline engine that this node changed.
              window.dispatchEvent(
                new CustomEvent("pipeline:changed")
              );
            }}
          />
          <SolidChip count={amount} />
        </Box>

        {config.info && config.info({...config, amount })}
      </NodeWrapper>

      {/* </SettingsSection> */}

      <OutputHandle id="image" />
    </>;
  }

  return SliderNode;
}
