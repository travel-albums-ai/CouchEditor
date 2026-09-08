import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { useTranslation } from 'react-i18next';

export default function MirrorNode() {
  const { t } = useTranslation();

  return <>
    <InputHandle id="image" />
    <NodeWrapper type="mirror" helper={<BeforeAfter image2style={{ transform: `scaleX(-1)` }} />}>
      <small>{t('pipelineMirrorDescription')}</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>
}
