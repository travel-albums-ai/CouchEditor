import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import { Box, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type GpsStats = {
  total: number;
  withGps: number;
  withoutGps: number;
};

type GpsStatsEvent = GpsStats & {
  nodeId: string;
};

function GpsSplitNode({ id }: NodeProps<Node>) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<GpsStats>({ total: 0, withGps: 0, withoutGps: 0 });
  const withGpsPercentage = stats.total > 0 ? (stats.withGps / stats.total) * 100 : 0;
  const withoutGpsPercentage = stats.total > 0 ? (stats.withoutGps / stats.total) * 100 : 0;

  useEffect(() => {
    const handleStats = (event: Event) => {
      const detail = (event as CustomEvent<GpsStatsEvent>).detail;

      if (detail?.nodeId !== id) return;

      setStats(detail);
    };

    window.addEventListener('gps-split:stats', handleStats);
    return () => window.removeEventListener('gps-split:stats', handleStats);
  }, [id]);

  return <>
    <InputHandle id="image" position={Position.Left} />
    <NodeWrapper type="gps-split" tools={<PipelineStageTiming nodeId={id} nodeType="gps-split" />}>
      <Box
        role="progressbar"
        aria-label={t('pipelineGpsSplitProgress')}
        aria-valuemin={0}
        aria-valuemax={stats.total}
        aria-valuenow={stats.withGps}
        sx={{
          display: 'flex',
          width: '100%',
          height: 14,
          overflow: 'hidden',
          borderRadius: 1,
          bgcolor: 'action.hover',
        }}
      >
        <Box sx={{ width: `${withGpsPercentage}%`, bgcolor: 'primary.main', transition: 'width 0.25s ease' }} />
        <Box sx={{ width: `${withoutGpsPercentage}%`, bgcolor: 'secondary.main', transition: 'width 0.25s ease' }} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 0.5, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">{t('pipelineGpsSplitTotal')}</Typography>
        <Typography variant="body2">{stats.total}</Typography>
        <Typography variant="caption" color="primary.main">{t('pipelineGpsSplitWithGps')}</Typography>
        <Typography variant="body2" color="primary.main">{stats.withGps}</Typography>
        <Typography variant="caption" color="secondary.main">{t('pipelineGpsSplitWithoutGps')}</Typography>
        <Typography variant="body2" color="secondary.main">{stats.withoutGps}</Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">{t('pipelineGpsSplitDescription')}</Typography>
    </NodeWrapper>
    <OutputHandle id="withGps" position={Position.Right} />
    <OutputHandle id="withoutGps" position={Position.Right} style={{ top: '70%' }} />
  </>;
}

export default GpsSplitNode;
