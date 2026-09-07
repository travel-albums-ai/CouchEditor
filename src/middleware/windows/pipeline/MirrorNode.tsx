import { BeforeAfter } from '@/middleware/windows/pipeline/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { SquareCenterlineDashedHorizontal } from 'lucide-react';

function MirrorNode() {
  return (
    <>
      <InputHandle id="image" />

      <NodeWrapper title={'Mirror'} icon={<SquareCenterlineDashedHorizontal size={16} />} toolbar={<></>} type="mirror">
        <small>Flips the image horizontally</small>
        <BeforeAfter image2style={{ transform: `scaleX(-1)` }} />
      </NodeWrapper>


      <OutputHandle id="image" />
    </>
  );
}

export default MirrorNode;
