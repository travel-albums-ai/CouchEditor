import AdjustmentSlider from '@/middleware/windows/pipeline/components/AdjustmentSlider';
import { type Node, type NodeProps } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToneNodeLayout from './ToneNodeLayout';

type TemperatureTintData = {
  temperature?: number;
  tint?: number;
};

export default function TemperatureTintNode({
  id,
  data,
}: NodeProps<Node<TemperatureTintData>>) {
  const { t } = useTranslation();
  const [temperature, setTemperature] = useState(data.temperature ?? 0);
  const [tint, setTint] = useState(data.tint ?? 0);

  return (
    <ToneNodeLayout id={id} type="temperature-tint">
      <label>
        {t('pipelineTemperature')}
        <AdjustmentSlider
          min={-100}
          max={100}
          step={1}
          value={temperature}
          onChange={(value) => {
            Object.assign(data, { temperature: value });
            setTemperature(value);
          }}
        />
      </label>
      <label>
        {t('pipelineTint')}
        <AdjustmentSlider
          min={-100}
          max={100}
          step={1}
          value={tint}
          onChange={(value) => {
            Object.assign(data, { tint: value });
            setTint(value);
          }}
        />
      </label>
    </ToneNodeLayout>
  );
}
