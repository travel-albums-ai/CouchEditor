import { Box } from '@mui/material';
import { MoveRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const previewImageUrl = 'sample.jpg';

type AdjustmentPreviewProps = {
  amount: number;
  algorithm: (amount: number) => (image: ImageData) => void;
  label: string;
};

export function AdjustmentPreview({ amount, algorithm, label }: AdjustmentPreviewProps) {
  const [processedImageUrl, setProcessedImageUrl] = useState(previewImageUrl);

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
      algorithm(amount)(imageData);
      context.putImageData(imageData, 0, 0);

      if (!cancelled) {
        setProcessedImageUrl(canvas.toDataURL('image/jpeg'));
      }
    };
    image.src = previewImageUrl;

    return () => {
      cancelled = true;
    };
  }, [algorithm, amount]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, justifyContent: 'center' }}>
      <img src={previewImageUrl} alt={`${label} preview before`} style={{ maxWidth: '50px' }} />
      <MoveRight aria-hidden="true" />
      <img src={processedImageUrl} alt={`${label} preview after`} style={{ maxWidth: '50px' }} />
    </Box>
  );
}