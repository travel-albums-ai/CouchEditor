import { BeforeAfter } from '@/middleware/windows/pipeline/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { SquaresExclude } from 'lucide-react';

function InvertNode() {
  return (
    <>
      <InputHandle id="image" />

      <NodeWrapper title={'Invert'} icon={<SquaresExclude size={16} />} toolbar={<></>} type="invert">
        <small>Inverts the colors of the image</small>
        <BeforeAfter image2style={{ filter: `invert(1)` }} />
      </NodeWrapper>

      <OutputHandle id="image" />
    </>
  );
}

export default InvertNode;
