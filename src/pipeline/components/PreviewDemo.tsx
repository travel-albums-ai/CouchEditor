import { PreviewDemoCss } from '@/pipeline/components/PreviewDemoCss';
import { PreviewDemoMath } from '@/pipeline/components/PreviewDemoMath';
import { PreviewDemoStatic } from '@/pipeline/components/PreviewDemoStatic';
import { NodePaletteItem, NodeProcessing } from '@/pipeline/NodePalette';

export default function PreviewDemo({ paletteItem } : { paletteItem: NodePaletteItem }) {

  return <>
    {paletteItem.processing === NodeProcessing.Static && <PreviewDemoStatic paletteItem={paletteItem} width={70} />}
    {paletteItem.processing === NodeProcessing.Css && <PreviewDemoCss paletteItem={paletteItem} width={70} />}
    {paletteItem.processing === NodeProcessing.Math && <PreviewDemoMath paletteItem={paletteItem} width={70} />}
  </>
}
