import { SegmentedControl, SegmentedControlItem } from '@/components/SegmentedControl';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { type Node, type NodeProps } from "@xyflow/react";
import { Maximize2 } from 'lucide-react';
import { useState } from "react";
import { useTranslation } from 'react-i18next';

const SCALE_PRESETS = [
  { value: "1", labelKey: "pipelineRescaleAuto" },
  { value: "0.1", labelKey: "pipelineRescalePreset10" },
  { value: "0.25", labelKey: "pipelineRescalePreset25" },
  { value: "0.5", labelKey: "pipelineRescalePreset50" },
  { value: "0.65", labelKey: "pipelineRescalePreset65" },
  { value: "0.85", labelKey: "pipelineRescalePreset85" },
  { value: "1.5", labelKey: "pipelineRescalePreset150" },
  { value: "2", labelKey: "pipelineRescalePreset200" },
];

function RescaleNode({
  data,
}: NodeProps<Node<{ scale?: number }>>) {
  const { t } = useTranslation();
  const [scale, setScale] = useState(String(data.scale ?? 1));

  return (<>
    <InputHandle id="image" />
    <NodeWrapper title={t('pipelineRescale')} icon={<Maximize2 />} toolbar={<></>} type="rescale">

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
            {t(preset.labelKey)}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <small>{t('pipelineRescaleDescription')}</small>

    </NodeWrapper>
    <OutputHandle id="image" />
  </>);
}

export default RescaleNode;
