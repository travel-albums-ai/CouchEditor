import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { useAISinkStoreSelector } from '@/context/aiSinkStore';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { useDescriptions } from '@/context/descriptionsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { Astroid, ListChecks } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Result = {
  index: number;
  description: string;
};

type Props = {
  photos: GalleryPhoto[];
  context: Record<string, unknown>;
};

type OpenAIResponse = {
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: {
            type: 'number',
          },
          description: {
            type: 'string',
          },
        },
        required: ['index', 'description'],
        additionalProperties: false,
      },
    },
  },
  required: ['results'],
  additionalProperties: false,
} as const;

export default function ImageAnalyzer({ photos, context }: Props) {
  const {
    byokOpenAIKey,
    mainPersona,
    additionalPersonas,
    model,
    serviceTier,
  } = useBYOKStoreSelector((state) => state);
  const { aiLoading } = useBYOKStoreSelector((state) => state);

  const { addUsageStat, setAILoading } = useBYOK()

  const imageBase64 = useAISinkStoreSelector((state) => state.autoDescriptionPreview);

  const { describePhoto } = useDescriptions();

  const prompts = useMemo(() => ({
    main: [
      'Look at all the photos and describe what is in each one.',
      'Return an array containing the photo index and description for each photo.',
      'Unclear photos can be described as "Unclear".',
      'Start from index 0.',
      'Return the result in JSON format.',
      'Max 30 words per description.',
    ].join(' '),

    mainPersonaPrompt:
      `If the person looks like: ${mainPersona.description}, then it's ${mainPersona.name}.`,

    friendsPrompt:
      additionalPersonas
        ?.map(
          (p) =>
            `If the person looks like: ${p.description}, then it's likely ${p.name}.`,
        )
        .join(' ') ?? '',
  }), [mainPersona, additionalPersonas]);

  const [results, setResults] = useState<Result[]>([]);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const lastAnalyzedImageRef = useRef<string | null>(null);

  async function analyze() {
    if (!imageBase64 || !byokOpenAIKey || aiLoading) return;

    setAILoading(true);
    setError(null);
    setResults([]);

    try {
      const input = [
        ...Object.values(prompts),
        ...Object.values(context),
      ]
        .filter((value) => value != null && value !== '')
        .map(String)
        .join('\n\n');

      const response = await fetch(OPENAI_RESPONSES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${byokOpenAIKey}`,
        },
        body: JSON.stringify({
          model,
          service_tier: serviceTier,

          input: [{
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: input,
              },
              {
                type: 'input_image',
                image_url: imageBase64,
              },
            ],
          }],

          text: {
            format: {
              type: 'json_schema',
              name: 'image_analysis',
              strict: true,
              schema: RESPONSE_SCHEMA,
            },
          },
        }),
      });

      const data = (await response.json()) as OpenAIResponse;

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
          `OpenAI request failed (${response.status})`,
        );
      }

      const outputText = data.output
        ?.filter((item) => item.type === 'message')
        .flatMap((item) => item.content ?? [])
        .find((content) => content.type === 'output_text')
        ?.text;

      if (!outputText) {
        throw new Error('OpenAI returned an empty response');
      }

      const parsed = JSON.parse(outputText) as {
        results: Result[];
      };

      setResults(parsed.results);
      addUsageStat({
        created_at: data.created_at ?? new Date().toISOString(),
        model: data.model,
        call_type: 'image_analysis',
        service_tier: data.service_tier,
        usage: data.usage ?? {
          input_tokens: 0,
          output_tokens: 0,
          total_tokens: 0,
          input_tokens_details: {},
          output_tokens_details: {},
        } });
    } catch (e) {
      console.error(e);

      setError(
        e instanceof Error
          ? e.message
          : 'Analysis failed',
      );
    } finally {
      setAILoading(false);
    }
  }

  function addAllDescriptions() {
    for (const result of results) {
      const photo = photos[result.index];

      if (photo) {
        describePhoto(photo.id, result.description);
      }
    }

    setResults([]);
  }

  // Drives the batch loop: analyze -> wait -> add all descriptions -> wait for the next batch's image -> repeat.
  useEffect(() => {
    if (!batchMode) return;

    if (photos.length === 0 || !byokOpenAIKey) {
      setBatchMode(false);
      return;
    }

    if (error) {
      setBatchMode(false);
      return;
    }

    if (aiLoading) return;

    if (results.length > 0) {
      addAllDescriptions();
      return;
    }

    if (imageBase64 && imageBase64 !== lastAnalyzedImageRef.current) {
      lastAnalyzedImageRef.current = imageBase64;
      analyze();
    }
  }, [batchMode, aiLoading, results, imageBase64, error, photos.length, byokOpenAIKey]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 1,
          flexGrow: 1,
        }}
      >
        {[...Object.entries(prompts), ...Object.entries(context)].map(
          ([key, desc]) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                borderBottom: 1,
                borderColor: 'divider',
                pb: 0.5,
              }}
            >
              <Typography
                variant="caption"
                color="textDisabled"
                sx={{
                  textTransform: 'capitalize',
                  flex: '0 0 120px',
                }}
              >
                {key}:
              </Typography>

              <Typography
                variant="caption"
                color="textSecondary"
              >
                {String(desc)}
              </Typography>
            </Box>
          ),
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Astroid size={16} />}
            variant="contained"
            onClick={analyze}
            disabled={!imageBase64 || !byokOpenAIKey || aiLoading || batchMode}
          >
            {aiLoading ? 'Analyzing…' : 'Analyze'}
          </Button>

          <Button
            variant="contained"
            onClick={addAllDescriptions}
            disabled={
              !imageBase64 ||
              !byokOpenAIKey ||
              aiLoading ||
              batchMode ||
              results.length === 0
            }
          >
            Add All Descriptions
          </Button>

          <Button
            startIcon={<ListChecks size={16} />}
            variant={batchMode ? 'contained' : 'outlined'}
            color={batchMode ? 'secondary' : 'primary'}
            onClick={() => setBatchMode((prev) => !prev)}
            disabled={!byokOpenAIKey || photos.length === 0}
          >
            {batchMode ? 'Stop Batch' : 'Run Batch'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {results.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            height: '500px',
            overflowY: 'auto',
          }}
        >
          <Stack spacing={1}>
            {results.map((result) => {
              const photo = photos[result.index];

              if (!photo) return null;

              return (
                <Box
                  key={result.index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    alignItems: 'center',
                    p: 1,
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 1,
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      position: 'relative',
                    }}
                  >
                    <AlbumPhotoThumbnailBackgroundNg photo={photo} />
                  </Box>

                  <Typography
                    color="textSecondary"
                    variant="caption"
                  >
                    {result.index + 1}: {result.description}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
