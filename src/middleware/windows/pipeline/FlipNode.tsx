import { BeforeAfter } from '@/middleware/windows/pipeline/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { SquareCenterlineDashedVertical } from 'lucide-react';

function FlipNode() {
  return (
    <>
      <InputHandle id="image" />

      <NodeWrapper title={'Flip 180°'} icon={<SquareCenterlineDashedVertical size={16} />} toolbar={<></>} type="flip">
        <small>Rotates the image upside down</small>
        <BeforeAfter image2style={{ transform: `rotate(180deg)` }} />
      </NodeWrapper>

      <OutputHandle id="image" />
    </>
  );
}

export default FlipNode;
