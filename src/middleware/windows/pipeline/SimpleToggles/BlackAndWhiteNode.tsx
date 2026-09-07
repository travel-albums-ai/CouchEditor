import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';

export default function BlackAndWhiteNode() {
  return <>
    <InputHandle id="image" />
    <NodeWrapper type="black-white" helper={<BeforeAfter image2style={{ filter: `grayscale(1)` }} />}>
      <small>Convert image to black & white</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>;
}
