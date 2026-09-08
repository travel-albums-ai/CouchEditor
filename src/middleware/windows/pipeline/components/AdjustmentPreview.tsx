import { Box, useTheme } from '@mui/material';
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
  const theme = useTheme();

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
    <Box sx={{
      display: 'flex', alignItems: 'center',
      gap: 1, px: 0.5, justifyContent: 'center',
      opacity: 0.85,
      transition: 'opacity 0.25s ease',
      '&:hover': {
        opacity: 1,
      }
    }}>
      <img src={previewImageUrl} alt={`${label} preview before`} style={{ maxWidth: '60px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />
      <MoveRight aria-hidden="true" />
      <img src={processedImageUrl} alt={`${label} preview after`} style={{ maxWidth: '60px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />
    </Box>
  );
}
