import { AdjustmentPreview } from '@/middleware/windows/pipeline/components/AdjustmentPreview';
import AdjustmentSlider from '@/middleware/windows/pipeline/components/AdjustmentSlider';
import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import { paletteItemsByType } from '@/middleware/windows/pipeline/NodePalette';
import { type Node, type NodeProps } from "@xyflow/react";
import { useState } from "react";

export type SliderNodeConfig = {
  type: string;
};

// Builds a single-slider node component sharing the same
// data.amount + "pipeline:changed" wiring as BrightnessNode.
export function createSliderNode(config: SliderNodeConfig) {
  function SliderNode({
    id,
    data,
  }: NodeProps<Node<{ amount?: number }>>) {
    const paletteItem = paletteItemsByType[config.type];

    const [amount, setAmount] = useState(data.amount ?? paletteItem?.config);
    const [isBusy, setIsBusy] = useState(false);


    const activeConfig = paletteItem?.config;

    return <>
      <InputHandle id="image" />
      <NodeWrapper type={config.type}
        tools={<PipelineStageTiming nodeId={id} nodeType={config.type} isBusy={setIsBusy} />}
        helper={<>
          {/* {config.info && config.info({...config, amount })} */}
          {paletteItem.processing === 'math' && <AdjustmentPreview
            amount={amount}
            // amount={amount !== 0 ? amount : (activeConfig?.max || 1) / 2}
            algorithm={paletteItem?.algo}
            label="Brightness"
          />}
          {/* {config.defaultValue === undefined && paletteItem.processing === 'css' && <BeforeAfter image2style={{ transform: paletteItem?.algo({ amount: amount !== 0 ? amount : (activeConfig?.max || 1) / 2 }) }} />} */}
          {paletteItem.processing === 'css' && <BeforeAfter image2style={{ ...paletteItem?.algo({ amount }) }} />}
        </>}
      >
        {/* {config.defaultValue !== undefined && 'OLD CODE'} */}

        {activeConfig?.min !== activeConfig?.max && <AdjustmentSlider
          disabled={isBusy}
          min={activeConfig?.min || 0}
          max={activeConfig?.max || 100}
          step={activeConfig?.step || 1}
          value={amount}
          throttleMs={1000}
          onChange={(newValue) => {
            data.amount = newValue;
            setAmount(newValue);
          }}
        />}

      </NodeWrapper>
      <OutputHandle id="image" />
    </>;
  }

  return SliderNode;
}
