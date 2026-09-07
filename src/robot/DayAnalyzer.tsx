import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import {
  Alert,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Astroid } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Props = {
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

const CACHE_PREFIX = 'day-analyzer:';
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

async function getCacheKey(input: string) {
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(input),
  );

  return (
    CACHE_PREFIX +
    [...new Uint8Array(hash)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  );
}

export default function DayAnalyzer({ context }: Props) {
  const {
    byokOpenAIKey,
    mainPersona,
    model,
    serviceTier,
    additionalPersonas,
  } = useBYOKStoreSelector((state) => state);
  const { addUsageStat, setAILoading } = useBYOK()

  const prompts = useMemo(() => ({
    main:
      'Make a story of max 100 words about the day based on the following descriptions. Do not mention the personas unless they are explicitly mentioned in the descriptions.',

    mainPersonaPrompt:
      `If the person seen in photos looks like: ${mainPersona.description}, then it's ${mainPersona.name}.`,

    friendsPrompt:
      additionalPersonas
        ?.map(
          (p) =>
            `If the person looks like: ${p.description}, then it's likely ${p.name}.`,
        )
        .join(' ') ?? '',
  }), [mainPersona, additionalPersonas]);

  const [result, setResult] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheKey, setCacheKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const input = JSON.stringify({
      prompts,
      context,
    });

    setResult(null);
    setCached(false);
    setError(null);
    setCacheKey(null);

    getCacheKey(input).then((key) => {
      if (cancelled) return;

      setCacheKey(key);

      const value = localStorage.getItem(key);

      if (value) {
        setResult(value);
        setCached(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [context, prompts]);

  async function analyze() {
    if (!byokOpenAIKey || loading || !cacheKey) return;

    setLoading(true);
    setError(null);

    try {
      // Another component/tab may have populated the cache.
      const existing = localStorage.getItem(cacheKey);

      if (existing) {
        setResult(existing);
        setCached(true);
        return;
      }

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
          input,
          text: {
            format: {
              type: 'json_schema',
              name: 'day_analysis',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  results: {
                    type: 'string',
                  },
                },
                required: ['results'],
                additionalProperties: false,
              },
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

      const value = JSON.parse(outputText).results;

      localStorage.setItem(cacheKey, value);

      setResult(value);
      addUsageStat({
        created_at: data.created_at ?? new Date().toISOString(),
        model: data.model,
        call_type: 'day_analysis',
        service_tier: data.service_tier,
        usage: data.usage ?? {
          input_tokens: 0,
          output_tokens: 0,
          total_tokens: 0,
          input_tokens_details: {},
          output_tokens_details: {},
        } });
      setCached(false);
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error
          ? e.message
          : 'Analysis failed',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      {!result && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            flexGrow: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<Astroid size={16} />}
              variant="outlined"
              size="small"
              onClick={analyze}
              disabled={!byokOpenAIKey || loading || !cacheKey}
            >
              {loading
                ? 'Describing...'
                : cached
                  ? 'Regenerate'
                  : 'Describe my moment'}
            </Button>
          </Box>
        </Box>
      )}

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {result && (
        <Box
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            flexGrow: 1,
            borderRadius: 2,
            bgcolor: 'background.paper',
            maxWidth: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mb: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="caption"
              color="textDisabled"
            >
              {cached ? 'Cached result' : 'Fresh result'}
            </Typography>

            <Button
              startIcon={<Astroid size={16} />}
              variant="outlined"
              size="small"
              onClick={analyze}
              disabled={!byokOpenAIKey || loading || !cacheKey}
            >
              {loading ? 'Thinking...' : 'Regenerate'}
            </Button>
          </Box>

          <Typography gutterBottom={false}>
            {result}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
