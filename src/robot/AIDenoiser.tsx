import { useAdjustments, useAdjustmentsStoreSelector } from '@/context/adjustmentsStore';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import {
  Alert,
  Box,
  Button
} from '@mui/material';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

const OPENAI_IMAGES_EDIT_URL = 'https://api.openai.com/v1/images/edits';
const IMAGE_MODEL = 'gpt-image-2';

type OpenAIImageResponse = {
  data?: Array<{
    b64_json?: string;
  }>;

  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;

    input_tokens_details?: {
      text_tokens?: number;
      image_tokens?: number;
    };

    output_tokens_details?: {
      image_tokens?: number;
    };
  };

  created?: number;

  error?: {
    message?: string;
  };
};


export default function AIDenoiser() {
  const { byokOpenAIKey, aiLoading } = useBYOKStoreSelector((state) => state);
  const { processedBase64 } = useAdjustmentsStoreSelector((state) => state)
  const { setSetting } = useAdjustments();
  const { setAILoading, addUsageStat } = useBYOK();

  const [error, setError] = useState<string | null>(null);

  async function colorize() {
    if (!processedBase64 || !byokOpenAIKey || aiLoading) {
      return;
    }

    setAILoading(true);
    setError(null);

    try {
      const imageBlob = await base64ToBlob(processedBase64);

      const formData = new FormData();

      formData.append('model', IMAGE_MODEL);

      formData.append(
        'prompt',
        [
          'Reduce excessive film grain, scan noise, and digital noise while preserving the natural texture and fine detail of the original photograph. Remove noise selectively rather than applying aggressive smoothing, with particular care around faces, hair, skin, fabric, foliage, architecture, and other areas containing genuine texture. Preserve authentic film grain where it contributes to the original photographic character. Do not introduce artificial sharpening, plastic-looking skin, invented texture, excessive smoothing, HDR effects, or a modern digital appearance. Preserve the original composition, geometry, identity, facial features, expressions, poses, objects, lighting, tonal relationships, and photographic character. The result should look like the same photograph captured or scanned with less distracting degradation, not like a newly generated image.',
        ].join(' '),
      );

      formData.append(
        'image[]',
        imageBlob,
        'source.jpg',
      );

      formData.append('size', 'auto');
      formData.append('quality', 'medium');
      formData.append('output_format', 'jpeg');
      formData.append('output_compression', '90');

      const response = await fetch(OPENAI_IMAGES_EDIT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${byokOpenAIKey}`,
        },
        body: formData,
      });

      const data = (await response.json()) as OpenAIImageResponse;

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            `OpenAI image edit failed (${response.status})`,
        );
      }

      const base64 = data.data?.[0]?.b64_json;

      if (!base64) {
        throw new Error('OpenAI returned no image');
      }

      const outputImage = `data:image/jpeg;base64,${base64}`;

      setSetting({ processedBase64: outputImage });

      addUsageStat({
        created_at: data.created
          ? new Date(data.created * 1000).toISOString()
          : new Date().toISOString(),

        model: IMAGE_MODEL,

        call_type: 'image_colorization',

        service_tier: undefined,

        usage: {
          input_tokens: data.usage?.input_tokens ?? 0,
          output_tokens: data.usage?.output_tokens ?? 0,
          total_tokens: data.usage?.total_tokens ?? 0,

          input_tokens_details:
            data.usage?.input_tokens_details ?? {},

          output_tokens_details:
            data.usage?.output_tokens_details ?? {},
        },
      });
    } catch (e) {
      console.error(e);

      setError(
        e instanceof Error
          ? e.message
          : 'Colorization failed',
      );
    } finally {
      setAILoading(false);
    }
  }

  const disabled =
    !processedBase64 ||
    !byokOpenAIKey ||
    aiLoading;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          startIcon={<Sparkles size={16} />}
          onClick={colorize}
          disabled={disabled}
        >
          {aiLoading ? 'Denoising…' : 'Denoise Photo'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
    </Box>
  );
}

async function base64ToBlob(
  base64: string,
): Promise<Blob> {
  const response = await fetch(base64);
  return response.blob();
}
