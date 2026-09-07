import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';

export default function SepiaNode() {
  return <>
    <InputHandle id="image" />
    <NodeWrapper type="sepia" helper={<BeforeAfter image2style={{ filter: `sepia(1)` }} />}>
      <small>Give the image a warm sepia tone</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>;
}
