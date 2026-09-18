import { InputHandle } from '@/pipeline/components/InputHandle';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/pipeline/components/PipelineStageTiming';
import { Box, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

const CHANNELS = ['red', 'green', 'blue', 'alpha'] as const;
const spacing = 14.5
const start = 43

function MergeChannelsNode({ id }: NodeProps<Node>) {
  const { t } = useTranslation();

  return <>
    {CHANNELS.map((channel, index) => (
      <InputHandle
        key={channel}
        id={channel}
        position={Position.Left}
        style={{ top: `${start + index * spacing}%` }}
        color={channel === 'red' ? 'red' : channel === 'green' ? 'green' : channel === 'blue' ? 'blue' : undefined}
      />
    ))}
    <NodeWrapper type="merge-channels" tools={<PipelineStageTiming nodeId={id} nodeType="merge-channels" />}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
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
