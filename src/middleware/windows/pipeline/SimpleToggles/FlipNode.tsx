import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';

export default function FlipNode() {
  return <>
    <InputHandle id="image" />
    <NodeWrapper type="flip" helper={<BeforeAfter image2style={{ transform: `rotate(180deg)` }} />}>
      <small>Rotates the image upside down</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>
}
