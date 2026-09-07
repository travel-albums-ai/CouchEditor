import { useEffect, useRef } from 'react';

import { useAdjustments, useAdjustmentsStoreSelector } from '@/context/adjustmentsStore';
import { runPipeline } from '@/middleware/interface/adjustments/canvasProcessing';
import { Stage } from '@/middleware/interface/adjustments/types';

export default function AdjustmentsProcess({
  pipeline,
}: {
  pipeline: (Stage | null)[];
}) {
  const canvasRef = useRef<OffscreenCanvas | null>(null);
  const originalRef = useRef<ImageData | null>(null);
  const lastWrittenRef = useRef<string | null>(null);

  const { setSetting } = useAdjustments();

  const processedBase64 = useAdjustmentsStoreSelector(
    (state) => state.processedBase64,
  );

  useEffect(() => {
    if (!processedBase64) {
      originalRef.current = null;
      lastWrittenRef.current = null;
      return;
    }

    if (processedBase64 === lastWrittenRef.current) {
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = new OffscreenCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvasRef.current = canvas;

      originalRef.current = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      );
    };

    img.src = processedBase64;
  }, [processedBase64]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const base = originalRef.current;

    if (!canvas || !base || !processedBase64) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const img = new ImageData(
      new Uint8ClampedArray(base.data),
      base.width,
      base.height,
    );

    runPipeline(img, pipeline);
    ctx.putImageData(img, 0, 0);

    const result = canvas.convertToBlob({
      type: 'image/jpeg',
      quality: 1,
    });

    result.then((blob) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result as string;

        lastWrittenRef.current = base64;

        setSetting({
          processedBase64: base64,
        });
      };

      reader.readAsDataURL(blob);
    });
  }, [pipeline, setSetting]);

  return null;
}
