import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';

export default function InvertNode() {
  return <>
    <InputHandle id="image" />
    <NodeWrapper type="invert" helper={<BeforeAfter image2style={{ filter: `invert(1)` }} />}>
      <small>Inverts the colors of the image</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>
}
