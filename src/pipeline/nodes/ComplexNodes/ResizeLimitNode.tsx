import { SegmentedControl, SegmentedControlItem } from '@/components/SegmentedControl';
import { InputHandle } from '@/pipeline/components/InputHandle';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/pipeline/components/PipelineStageTiming';
import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

const SIZE_PRESETS = [
  { value: "128", labelKey: "0.125K" },
  { value: "256", labelKey: "0.25K" },
  { value: "512", labelKey: "pipelineResizeLimitPreset05K" },
  { value: "1024", labelKey: "pipelineResizeLimitPreset1K" },
  { value: "2048", labelKey: "pipelineResizeLimitPreset2K" },
  { value: "4096", labelKey: "pipelineResizeLimitPreset4K" },
];

function ResizeLimitNode({
  id,
  data,
}: NodeProps<Node<{ maxDimension?: number }>>) {
  const { t } = useTranslation();
  const { setNodes } = useReactFlow();
  const [maxDimension, setMaxDimension] = useState(String(data.maxDimension ?? 4096));
  const [isBusy, setIsBusy] = useState(false);

  return (<>
    <InputHandle id="image" />
    <NodeWrapper tools={<PipelineStageTiming nodeId={id} nodeType={'resize-limit'} isBusy={setIsBusy} />}
      type="resize-limit">
      <SegmentedControl
        value={maxDimension}
        onChange={(_, value) => {
          const nextMaxDimension = Number(value);
          setNodes((nodes) => nodes.map((node) => (
            node.id === id
              ? { ...node, data: { ...node.data, maxDimension: nextMaxDimension } }
              : node
          )));
          setMaxDimension(value);

          window.dispatchEvent(
            new CustomEvent("pipeline:changed")
          );
        }}
        fullWidth
      >
        {SIZE_PRESETS.map((preset) => (
          <SegmentedControlItem key={preset.value} disabled={isBusy} value={preset.value}>
            {t(preset.labelKey)}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <small>{t('pipelineResizeLimitDescription')}</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>);
}

export default ResizeLimitNode;
