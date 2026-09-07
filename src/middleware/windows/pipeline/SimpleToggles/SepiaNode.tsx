import { BeforeAfter } from '@/middleware/windows/pipeline/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';

export default function SepiaNode() {
  return <>
    <InputHandle id="image" />
    <NodeWrapper type="sepia" helper={<BeforeAfter image2style={{ filter: `sepia(1)` }} />}>
      <small>Give the image a warm sepia tone</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>;
}
