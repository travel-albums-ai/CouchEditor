import AdjustmentSlider from '@/windows/pipeline/components/AdjustmentSlider';
import { InputHandle } from '@/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/windows/pipeline/components/PipelineStageTiming';
import { PreviewCss } from '@/windows/pipeline/components/PreviewCss';
import { PreviewDemoStatic } from '@/windows/pipeline/components/PreviewDemoStatic';
import { PreviewMath } from '@/windows/pipeline/components/PreviewMath';
import { paletteItemsByType } from '@/windows/pipeline/NodePalette';
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
        {paletteItem.configs?.length === 0 && <>
          {paletteItem.processing === 'static' && <PreviewDemoStatic paletteItem={paletteItem} showText={false} />}
          {paletteItem.processing === 'math' && <PreviewMath paletteItem={paletteItem} data={data} showText={false} />}
          {paletteItem.processing === 'css' && <PreviewCss paletteItem={paletteItem} image2style={{ ...paletteItem?.algo(data) }} data={data} showText={false} />}
        </>}
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
