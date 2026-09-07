import { useEffect, useRef } from 'react';

import { Box } from '@mui/material';

import { runPipeline } from '@/middleware/interface/adjustments/canvasProcessing';
import { Stage } from '@/middleware/interface/adjustments/types';

export default function AdjustmentsCanvas({
  pipeline,
  url,
  sx,
}: {
  pipeline: (Stage | null)[];
  url: string;
  sx?: any;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRef = useRef<ImageData | null>(null);

  const render = () => {
    const canvas = canvasRef.current;
    const base = originalRef.current;
    if (!canvas || !base) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const img = new ImageData(new Uint8ClampedArray(base.data), base.width, base.height);

    runPipeline(img, pipeline);
    ctx.putImageData(img, 0, 0);
  };

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      originalRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

      render();
    };

    img.src = url;
  }, [url]);

  useEffect(() => {
    render();
  }, [pipeline]);


  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
}
