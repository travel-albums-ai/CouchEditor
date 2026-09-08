import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { type Node, type NodeProps } from '@xyflow/react';
import { Film } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function LutNode({ data }: NodeProps<Node<{ lutFile?: File }>>) {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState(data.lutFile?.name ?? '');

  return (
    <>
      <InputHandle id="image" />

      <NodeWrapper title={t('pipelineLut')} icon={<Film />} toolbar={<></>} type="lut">
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
        <small>{fileName || t('pipelineLutChooseFile')}</small>
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}

export default LutNode;
