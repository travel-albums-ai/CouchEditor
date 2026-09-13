import { PreviewDemoCss } from '@/middleware/windows/pipeline/components/PreviewDemoCss';
import { PreviewDemoMath } from '@/middleware/windows/pipeline/components/PreviewDemoMath';
import { PreviewDemoStatic } from '@/middleware/windows/pipeline/components/PreviewDemoStatic';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';

export default function PreviewDemo({ paletteItem } : { paletteItem: NodePaletteItem }) {

  return <>
    {paletteItem.processing === 'static' && <PreviewDemoStatic paletteItem={paletteItem} />}
    {paletteItem.processing === 'css' && <PreviewDemoCss paletteItem={paletteItem} />}
    {paletteItem.processing === 'math' && <PreviewDemoMath paletteItem={paletteItem} />}
  </>
}
