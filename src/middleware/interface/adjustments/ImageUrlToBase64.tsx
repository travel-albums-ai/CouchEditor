import { useAdjustments, useAdjustmentsStoreSelector } from '@/context/adjustmentsStore';
import { useEffect } from 'react';

type ImageUrlToBase64Props = {
  imageUrl: string | null;
};

export default function ImageUrlToBase64({
  imageUrl,
}: ImageUrlToBase64Props) {
  const { setSetting } = useAdjustments();
  const { originalBase64 } = useAdjustmentsStoreSelector((state) => state)

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;

    async function convert() {
      try {
        const response = await fetch(imageUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch image: ${response.status} ${response.statusText}`,
          );
        }

        const blob = await response.blob();

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result !== 'string') {
              reject(new Error('Failed to convert image to Base64'));
              return;
            }

            resolve(reader.result);
          };

          reader.onerror = () => {
            reject(reader.error ?? new Error('FileReader failed'));
          };

          reader.readAsDataURL(blob);
        });

        if (!cancelled) {
          if (originalBase64 === base64) return;
          setSetting({ originalBase64: base64, processedBase64: base64 });
        }
      } catch (error) {
        if (!cancelled) {
          setSetting({ originalBase64: null, processedBase64: null });
        }
      }
    }

    convert();

    return () => {
      cancelled = true;
    };
  }, [imageUrl, originalBase64]);

  return null;
}
