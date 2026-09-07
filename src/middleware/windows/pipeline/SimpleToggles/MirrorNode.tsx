import { BeforeAfter } from '@/middleware/windows/pipeline/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';

export default function MirrorNode() {
  return <>
    <InputHandle id="image" />
    <NodeWrapper type="mirror" helper={<BeforeAfter image2style={{ transform: `scaleX(-1)` }} />}>
      <small>Flips the image horizontally</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>
}
