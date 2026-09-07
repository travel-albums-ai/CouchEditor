import IndexerMetricCard from '@/components/IndexerMetricCard';
import SettingsSection from '@/components/SettingsSection';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_IndexerOff } from '@/hooks/remote/useFetch_IndexerOff';
import { useFetch_IndexerOn } from '@/hooks/remote/useFetch_IndexerOn';
import { useFetch_TakeoutMetadata } from '@/hooks/remote/useFetch_TakeoutMetadata';
import { Box, Button, Typography } from '@mui/material';
import {
  Bug,
  Check,
  Database,
  History,
  Search,
  Turtle
} from 'lucide-react';

const systemCores = navigator.hardwareConcurrency || 4; // Fallback to 4 if unavailable

const items = [
  {
    key: 'done',
    label: 'Done',
    icon: <Check size={24} />,
  },
  {
    key: 'preindexed',
    label: 'Pre-indexed',
    icon: <History size={24} />,
  },
  {
    key: 'totalFound',
    label: 'Discovered',
    icon: <Search size={24} />,
  },
  {
    key: 'failed',
    label: 'Failed',
    icon: <Bug size={24} />,
  },
  {
    key: 'imagesPerSecond',
    label: 'Images per Second',
    icon: <Turtle size={24} />,
    format: (value: number) => value.toFixed(2),
  },
  {
    key: 'bytesConsumed',
    label: "MB Consumed",
    icon: <Database size={24} />,
    format: (value: number) => (value / (1024 * 1024)).toFixed(2),
  },
  {
    key: 'ramUsageBytes',
    label: "RAM Usage",
    icon: <Database size={24} />,
    format: (value: number) => (value / (1024 * 1024)).toFixed(2),
  },
  {
    key: 'cpuUsagePercent',
    label: `CPU Usage (${systemCores} cores)`,
    icon: <Database size={24} />,
    format: (value: number) => (value / systemCores).toFixed(2),
  }
];

export default function IndexerContent() {
  const { setSetting } = useSettings();
  const indexing = useSettingsStoreSelector((state) => state.indexing);
  const progress = useSettingsStoreSelector((state) => state.indexerProgress);
  const { forceRefresh } = useFetch_TakeoutMetadata();

  const { turnOnJob } = useFetch_IndexerOn();
  const { turnOffJob } = useFetch_IndexerOff();

  const handleTurnOn = async () => {
    try {
      await turnOnJob();

      setSetting((prev) => ({
        ...prev,
        indexing: true,
        loading: true,
        indexerStartedAt: Date.now(),
      }));
      forceRefresh()
    } catch (err) {
      console.error(err);
    }
  };

  const handleTurnOff = async () => {
    try {
      await turnOffJob();

      setSetting((prev) => ({
        ...prev,
        indexing: false,
        loading: false,
        indexerStartedAt: null,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SettingsSection title="Indexer" icon={<Database />} gap={2} uuid="indexer-content">
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1}}>
        <Button
          disabled={indexing}
          variant="contained"
          color="primary"
          onClick={handleTurnOn}
        >
          On
        </Button>

        <Button
          disabled={!indexing}
          variant="contained"
          color="primary"
          onClick={handleTurnOff}
        >
          Off
        </Button>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {indexing ? 'Indexer is running' : 'Indexer is stopped'}
          </Typography>

          <Box
            sx={{
              borderRadius: '50%',
              width: 10,
              height: 10,
              mr: 2,
              backgroundColor: indexing ? 'success.main' : 'divider',
              opacity: indexing ? 0.5 : 1,
              transition: 'background-color 0.3s ease, opacity 0.3s ease',
            }}
          />
        </Box>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 1,
      }}
      >
        {Object.keys(progress).length > 0 &&
          Object.entries(progress)
            .filter(([key]) => items.some((item) => item.key === key))
            .map(([key, value]) => (
              <Box key={key} sx={{ flex: '0 1 20%' }}>
                <IndexerMetricCard
                  line={`${key}: ${items.find((item) => item.key === key)?.format ? items.find((item) => item.key === key)?.format(value) : value}`}
                  object={{
                    icon: items.find((item) => item.key === key)?.icon,
                    label: items.find((item) => item.key === key)?.label || key,
                  }}
                  showChart
                />
              </Box>
            ))}
      </Box>
    </SettingsSection>
  );
}
