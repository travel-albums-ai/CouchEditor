import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { type Node, type NodeProps } from '@xyflow/react';
import { Film } from 'lucide-react';
import { useState } from 'react';

function LutNode({ data }: NodeProps<Node<{ lutFile?: File }>>) {
  const [fileName, setFileName] = useState(data.lutFile?.name ?? '');

  return (
    <>
      <InputHandle id="image" />

      <NodeWrapper title={'3D LUT'} icon={<Film />} toolbar={<></>} type="lut">
        <input
          type="file"
          accept=".cube,text/plain"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (!file) return;

            Object.assign(data, { lutFile: file });
            setFileName(file.name);
            window.dispatchEvent(new CustomEvent('pipeline:changed'));
          }}
        />
        <small>{fileName || 'Choose a .cube LUT'}</small>
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}

export default LutNode;
