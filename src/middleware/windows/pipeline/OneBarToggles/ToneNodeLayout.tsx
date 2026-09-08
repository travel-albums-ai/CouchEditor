import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import type { ReactNode } from 'react';

type ToneNodeLayoutProps = {
  id: string;
  type: string;
  children: ReactNode;
};

export default function ToneNodeLayout({ id, type, children }: ToneNodeLayoutProps) {
  return (
    <>
      <InputHandle id="image" />
      <NodeWrapper
        type={type}
        tools={<PipelineStageTiming nodeId={id} nodeType={type} />}
      >
        {children}
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}