import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { useTranslation } from 'react-i18next';

export default function FlipNode() {
  const { t } = useTranslation();

  return <>
    <InputHandle id="image" />
    <NodeWrapper type="flip" helper={<BeforeAfter image2style={{ transform: `rotate(180deg)` }} />}>
      <small>{t('pipelineFlipDescription')}</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>
}
