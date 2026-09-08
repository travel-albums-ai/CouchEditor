import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { useTranslation } from 'react-i18next';

export default function BlackAndWhiteNode() {
  const { t } = useTranslation();

  return <>
    <InputHandle id="image" />
    <NodeWrapper type="black-white" helper={<BeforeAfter image2style={{ filter: `grayscale(1)` }} />}>
      <small>{t('pipelineBlackAndWhiteDescription')}</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>;
}
