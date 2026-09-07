import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Astroid, Trash } from 'lucide-react';
import { useState } from 'react';

type CostAnalysis = {
  total_cost_euro: number;
};

type CloudPriceResponse = {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  input_cost?: number;
  output_cost?: number;
  total_cost?: number;
  cost?: number;
  currency?: string;
  error?: string;
  message?: string;
};

const CLOUDPRICE_BASE_URL = 'https://ai.cloudprice.net/api/v1/models';


export default function CostAnalyzer() {
  const { usageStats, model, serviceTier } = useBYOKStoreSelector((state) => state);
  const { clearUsageStats } = useBYOK()

  const [results, setResults] =
    useState<CostAnalysis | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function calculateCost() {
    if (loading) return;

    if (!usageStats?.length) {
      setError('No API usage records available.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const totalInputTokens = usageStats.reduce((total, stat) => total + stat.usage.input_tokens * 1000, 0);
      const totalOutputTokens = usageStats.reduce((total, stat) => total + stat.usage.output_tokens * 1000, 0);

      const url = new URL(`${CLOUDPRICE_BASE_URL}/${model}/pricing/calculate`);
      url.searchParams.set('input_tokens', String(totalInputTokens));
      url.searchParams.set('output_tokens', String(totalOutputTokens));

      const response = await fetch(url);

      const data =
        (await response.json()) as CloudPriceResponse;

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `CloudPrice request failed (${response.status})`,
        );
      }

      const myCosts = data?.data?.options?.find((option) => option.tier === serviceTier && option.provider_name === 'OpenAI' && option.provider_model_id === model);

      setResults({ total_cost_euro: myCosts?.total_cost / 100 });
    } catch (e) {
      console.error(e);

      setError(
        e instanceof Error
          ? e.message
          : 'Cost calculation failed',
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
        gap: 1,
        alignItems: 'center',
      }}
    >
      {results && (
        <Typography
          variant="body2"
          sx={{ fontWeight: 700 }}
        >
            Cost: €
          {results.total_cost_euro.toFixed(6)}
        </Typography>
      )}

      <IconButton
        // variant="outlined"
        // startIcon={<Trash size={16} />}
        size="small"
        color="inherit"
        onClick={clearUsageStats}
        disabled={loading || !usageStats?.length}
      >
        <Trash size={16} />
      </IconButton>
      <Button
        variant="outlined"
        startIcon={<Astroid size={16} />}
        size="small"
        color="inherit"
        onClick={calculateCost}
        disabled={loading || !usageStats?.length}
      >
        {loading ? 'Calculating…' : 'Calculate cost'}
      </Button>

      {error && (
        <Typography
          variant="body2"
          color="error"
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}
