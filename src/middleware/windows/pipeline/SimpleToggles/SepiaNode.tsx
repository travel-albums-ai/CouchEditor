import { BeforeAfter } from '@/middleware/windows/pipeline/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { Palette } from 'lucide-react';

function SepiaNode() {
  return (<>
    <InputHandle id="image" />
    <NodeWrapper title={'Sepia'} icon={<Palette />} toolbar={<></>} type="sepia">
      <small>Give the image a warm sepia tone</small>
      <BeforeAfter image2style={{ filter: `sepia(1)` }} />
    </NodeWrapper>
    <OutputHandle id="image" />
  </>);
}

export default SepiaNode;
