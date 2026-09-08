import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import { useTranslation } from 'react-i18next';

export default function SepiaNode({ id } : { id: string }) {
  const { t } = useTranslation();

  return <>
    <InputHandle id="image" />
    <NodeWrapper type="sepia"
      tools={<PipelineStageTiming nodeId={id} nodeType={'sepia'} />}
      helper={<BeforeAfter image2style={{ filter: `sepia(1)` }} />}>
      <small>{t('pipelineSepiaDescription')}</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>;
}
