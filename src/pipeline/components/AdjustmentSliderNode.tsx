import AdjustmentSlider from '@/pipeline/components/AdjustmentSlider';
import { InputHandle } from '@/pipeline/components/InputHandle';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/pipeline/components/PipelineStageTiming';
import { PreviewCss } from '@/pipeline/components/PreviewCss';
import { PreviewDemoStatic } from '@/pipeline/components/PreviewDemoStatic';
import { PreviewMath } from '@/pipeline/components/PreviewMath';
import { paletteItemsByType } from '@/pipeline/NodePalette';
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
      {paletteItem.processing === 'static' && <PreviewDemoStatic paletteItem={paletteItem} />}
      {paletteItem.processing === 'math' && <PreviewMath paletteItem={paletteItem} data={data} />}
      {paletteItem.processing === 'css' && <PreviewCss paletteItem={paletteItem} image2style={{ ...paletteItem?.algo(data) }} data={data} />}
    </>

    return <>
      <InputHandle id="image" />
      <NodeWrapper type={config.type}
        tools={<PipelineStageTiming nodeId={id} nodeType={config.type} isBusy={setIsBusy} />}
        helper={helper}
      >
        {paletteItem.configs?.length >  0 ? (paletteItem.configs || [])
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
          )) : null}
      </NodeWrapper>
      <OutputHandle id="image" />
    </>;
  }

  return SliderNode;
}
