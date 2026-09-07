import { BeforeAfter } from '@/middleware/windows/pipeline/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';

export default function FlipNode() {
  return <>
    <InputHandle id="image" />
    <NodeWrapper type="flip" helper={<BeforeAfter image2style={{ transform: `rotate(180deg)` }} />}>
      <small>Rotates the image upside down</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>
}
