import { InputHandle } from '@/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/windows/pipeline/components/PipelineStageTiming';
import { PreviewMath } from '@/windows/pipeline/components/PreviewMath';
import { paletteItemsByType } from '@/windows/pipeline/NodePalette';
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
