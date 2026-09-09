import AdjustmentSlider from '@/middleware/windows/pipeline/components/AdjustmentSlider';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
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
    id,
    data,
  }: NodeProps<Node<{ amount?: number }>>) {
    const [amount, setAmount] = useState(data.amount ?? config.defaultValue);
    const [isBusy, setIsBusy] = useState(false);

    return <>
      <InputHandle id="image" />
      <NodeWrapper type={config.type}
        tools={<PipelineStageTiming nodeId={id} nodeType={config.type} isBusy={setIsBusy} />}
        helper={<>
          {config.info && config.info({...config, amount })}
        </>}>
        <AdjustmentSlider
          disabled={isBusy}
          min={config.min}
          max={config.max}
          step={config.step}
          value={amount}
          throttleMs={1000}
          onChange={(newValue) => {
            data.amount = newValue;
            setAmount(newValue);
          }}
        />

      </NodeWrapper>
      <OutputHandle id="image" />
    </>;
  }

  return SliderNode;
}
