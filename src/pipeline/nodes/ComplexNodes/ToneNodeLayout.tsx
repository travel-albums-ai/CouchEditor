import { InputHandle } from '@/pipeline/components/InputHandle';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/pipeline/components/PipelineStageTiming';
import { PreviewMath } from '@/pipeline/components/PreviewMath';
import { paletteItemsByType } from '@/pipeline/NodePalette';
import type { ReactNode } from 'react';

type ToneNodeLayoutProps = {
  id: string;
  type: string;
  children: ReactNode;
  runningConfig: any;
};

export default function ToneNodeLayout({ id, type, children, runningConfig = {} }: ToneNodeLayoutProps) {

  const paletteItem = paletteItemsByType[type];

  return (
    <>
      <InputHandle id="image" />
      <NodeWrapper
        type={type}
        tools={<PipelineStageTiming nodeId={id} nodeType={type} />}
        helper={<PreviewMath paletteItem={paletteItem} data={runningConfig} />}
      >
        {children}
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}
