import AdjustmentSlider from '@/middleware/windows/pipeline/components/AdjustmentSlider';
import { type Node, type NodeProps } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToneNodeLayout from './ToneNodeLayout';

type WhitesBlacksData = {
  whites?: number;
  blacks?: number;
};

export default function WhitesBlacksNode({
  id,
  data,
}: NodeProps<Node<WhitesBlacksData>>) {
  const { t } = useTranslation();
  const [whites, setWhites] = useState(data.whites ?? 0);
  const [blacks, setBlacks] = useState(data.blacks ?? 0);

  return (
    <ToneNodeLayout id={id} type="whites-blacks">
      <label>
        {t('pipelineWhites')}
        <AdjustmentSlider
          min={-100}
          max={100}
          step={1}
          value={whites}
          onChange={(value) => {
            Object.assign(data, { whites: value });
            setWhites(value);
          }}
        />
      </label>
      <label>
        {t('pipelineBlacks')}
        <AdjustmentSlider
          min={-100}
          max={100}
          step={1}
          value={blacks}
          onChange={(value) => {
            Object.assign(data, { blacks: value });
            setBlacks(value);
          }}
        />
      </label>
    </ToneNodeLayout>
  );
}