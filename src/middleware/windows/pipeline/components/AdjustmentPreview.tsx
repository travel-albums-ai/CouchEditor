import { PreviewBeforeAfter } from '@/middleware/windows/pipeline/components/PreviewBeforeAfter';
import { NodePaletteItem } from '@/middleware/windows/pipeline/NodePalette';
import { useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

const previewImageUrl = 'sample.jpg';

type AdjustmentPreviewProps = {
  data: Record<string, any>;
  paletteItem: NodePaletteItem;
};

export function AdjustmentPreview({ data, paletteItem }: AdjustmentPreviewProps) {
  const [processedImageUrl, setProcessedImageUrl] = useState(previewImageUrl);
  const theme = useTheme();

  const runAlgorithm = (imageData: ImageData) => {
    const stage = paletteItem.algo?.(data);
    stage?.(imageData);
  };

  useEffect(() => {
    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext('2d');
      if (!context) return;

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      runAlgorithm(imageData);
      context.putImageData(imageData, 0, 0);

      if (!cancelled) {
        setProcessedImageUrl(canvas.toDataURL('image/jpeg'));
      }
    };
    image.src = previewImageUrl;

    return () => {
      cancelled = true;
    };
  }, [data, paletteItem]);

  return (<>
    <PreviewBeforeAfter
      after={<img src={processedImageUrl} style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />}
      value={data ? Object.values(data)?.[0] : 0}
    />
  </>);
}
