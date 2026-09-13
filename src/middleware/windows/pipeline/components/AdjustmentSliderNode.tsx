import AdjustmentSlider from '@/middleware/windows/pipeline/components/AdjustmentSlider';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import { PreviewCss } from '@/middleware/windows/pipeline/components/PreviewCss';
import { PreviewMath } from '@/middleware/windows/pipeline/components/PreviewMath';
import { paletteItemsByType } from '@/middleware/windows/pipeline/NodePalette';
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

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
    const { setNodes } = useReactFlow();
    const { t } = useTranslation();
    const [isBusy, setIsBusy] = useState(false);

    const helper = <>
      {paletteItem.processing === 'math' && <PreviewMath paletteItem={paletteItem} data={data} />}
      {paletteItem.processing === 'css' && <PreviewCss image2style={{ ...paletteItem?.algo(data) }} data={data} />}
    </>

    return <>
      <InputHandle id="image" />
      <NodeWrapper type={config.type}
        tools={<PipelineStageTiming nodeId={id} nodeType={config.type} isBusy={setIsBusy} />}
        helper={paletteItem.configs?.length !== 0 ? helper : undefined}
      >
        {paletteItem.configs?.length === 0 && helper}
        {(paletteItem.configs || [])
          .filter(config => config.min !== config.max)
          .map((config) => (
            <AdjustmentSlider
              key={config.key}
              description={config.labelKey ? t(config.labelKey) : undefined}
              disabled={isBusy}
              min={config.min || 0}
              max={config.max || 100}
              step={config.step || 1}
              throttleMs={1000}
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

  return SliderNode;
}
