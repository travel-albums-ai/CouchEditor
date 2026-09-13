import { AdjustmentPreview } from '@/middleware/windows/pipeline/components/AdjustmentPreview';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import { paletteItemsByType } from '@/middleware/windows/pipeline/NodePalette';
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
        helper={<AdjustmentPreview
          algorithm={(imageData) => {
            const stage = paletteItem.algo?.(runningConfig);
            stage?.(imageData);
          }} />}
      >
        {children}
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}
