import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import { Box, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

const CHANNELS = ['red', 'green', 'blue', 'alpha'] as const;

function MergeChannelsNode({ id }: NodeProps<Node>) {
  const { t } = useTranslation();

  return <>
    {CHANNELS.map((channel, index) => (
      <InputHandle
        key={channel}
        id={channel}
        position={Position.Left}
        style={{ top: `${24 + index * 17}%` }}
      />
    ))}
    <NodeWrapper type="merge-channels" tools={<PipelineStageTiming nodeId={id} nodeType="merge-channels" />}>
      <Typography variant="body2">{t('pipelineMergeChannels')}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.5 }}>
        {CHANNELS.map((channel) => (
          <Typography key={channel} variant="caption" color="text.secondary">
            {t(`pipelineSplitChannels${channel[0].toUpperCase()}${channel.slice(1)}`)}
          </Typography>
        ))}
      </Box>
    </NodeWrapper>
    <OutputHandle id="image" position={Position.Right} />
  </>;
}

export default MergeChannelsNode;
