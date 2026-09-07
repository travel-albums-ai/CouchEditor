import { BeforeAfter } from '@/middleware/windows/pipeline/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';

export default function BlackAndWhiteNode() {
  return <>
    <InputHandle id="image" />
    <NodeWrapper type="black-white" helper={<BeforeAfter image2style={{ filter: `grayscale(1)` }} />}>
      <small>Convert image to black & white</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>;
}
