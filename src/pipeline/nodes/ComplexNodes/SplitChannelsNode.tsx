import { InputHandle } from '@/pipeline/components/InputHandle';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/pipeline/components/PipelineStageTiming';
import { Box, Typography, useTheme } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

const CHANNELS = ['red', 'green', 'blue', 'alpha'] as const;
const spacing = 14.5
const start = 43

function SplitChannelsNode({ id }: NodeProps<Node>) {
  const { t } = useTranslation();
  const theme = useTheme()

  return <>
    <InputHandle id="image" position={Position.Left} />
    <NodeWrapper type="split-channels" tools={<PipelineStageTiming nodeId={id} nodeType="split-channels" />}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
        {CHANNELS.map((channel) => (
          <Typography key={channel} variant="caption" color="textSecondary">
            {t(`pipelineSplitChannels${channel[0].toUpperCase()}${channel.slice(1)}`)}
          </Typography>
        ))}
      </Box>
    </NodeWrapper>
    <OutputHandle id="red" position={Position.Right} style={{ top: `${start}%` }} color={theme.palette.error.main} />
    <OutputHandle id="green" position={Position.Right} style={{ top: `${start + spacing}%` }} color={theme.palette.success.main} />
    <OutputHandle id="blue" position={Position.Right} style={{ top: `${start + spacing * 2}%` }} color={theme.palette.info.main} />
    <OutputHandle id="alpha" position={Position.Right} style={{ top: `${start + spacing * 3}%` }} />
  </>;
}

export default SplitChannelsNode;
