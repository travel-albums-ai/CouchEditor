import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Box, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ExifStats = {
  total: number;
  withExif: number;
  withoutExif: number;
};

type ExifStatsEvent = ExifStats & {
  nodeId: string;
};

function ExifSplitNode({ id }: NodeProps<Node>) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<ExifStats>({ total: 0, withExif: 0, withoutExif: 0 });
  const withExifPercentage = stats.total > 0 ? (stats.withExif / stats.total) * 100 : 0;
  const withoutExifPercentage = stats.total > 0 ? (stats.withoutExif / stats.total) * 100 : 0;

  useEffect(() => {
    const handleStats = (event: Event) => {
      const detail = (event as CustomEvent<ExifStatsEvent>).detail;

      if (detail?.nodeId !== id) return;

      setStats(detail);
    };

    window.addEventListener('exif-split:stats', handleStats);
    return () => window.removeEventListener('exif-split:stats', handleStats);
  }, [id]);

  return <>
    <InputHandle id="image" position={Position.Left} />
    <NodeWrapper type="exif-split">
      <Box
        role="progressbar"
        aria-label={t('pipelineExifSplitProgress')}
        aria-valuemin={0}
        aria-valuemax={stats.total}
        aria-valuenow={stats.withExif}
        sx={{
          display: 'flex',
          width: '100%',
          height: 14,
          overflow: 'hidden',
          borderRadius: 1,
          bgcolor: 'action.hover',
        }}
      >
        <Box sx={{ width: `${withExifPercentage}%`, bgcolor: 'primary.main', transition: 'width 0.25s ease' }} />
        <Box sx={{ width: `${withoutExifPercentage}%`, bgcolor: 'secondary.main', transition: 'width 0.25s ease' }} />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 0.5, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">{t('pipelineExifSplitTotal')}</Typography>
        <Typography variant="body2">{stats.total}</Typography>
        <Typography variant="caption" color="primary.main">{t('pipelineExifSplitWithExif')}</Typography>
        <Typography variant="body2" color="primary.main">{stats.withExif}</Typography>
        <Typography variant="caption" color="secondary.main">{t('pipelineExifSplitWithoutExif')}</Typography>
        <Typography variant="body2" color="secondary.main">{stats.withoutExif}</Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">{t('pipelineExifSplitDescription')}</Typography>
    </NodeWrapper>
    <OutputHandle id="withExif" position={Position.Right} />
    <OutputHandle id="withoutExif" position={Position.Right} style={{ top: '70%' }} />
  </>;
}

export default ExifSplitNode;
