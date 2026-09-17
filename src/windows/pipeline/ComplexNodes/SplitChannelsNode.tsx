import { InputHandle } from '@/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/windows/pipeline/components/PipelineStageTiming';
import { Box, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

function SplitChannelsNode({ id }: NodeProps<Node>) {
  const { t } = useTranslation();

  return <>
    <InputHandle id="image" position={Position.Left} />
    <NodeWrapper type="split-channels" tools={<PipelineStageTiming nodeId={id} nodeType="split-channels" />}>
      <Typography variant="body2">{t('pipelineSplitChannels')}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.5 }}>
        {(['red', 'green', 'blue', 'alpha'] as const).map((channel) => (
          <Typography key={channel} variant="caption" color="text.secondary">
            {t(`pipelineSplitChannels${channel[0].toUpperCase()}${channel.slice(1)}`)}
          </Typography>
        ))}
      </Box>
    </NodeWrapper>
    <OutputHandle id="red" position={Position.Right} style={{ top: '25%' }} />
    <OutputHandle id="green" position={Position.Right} style={{ top: '42%' }} />
    <OutputHandle id="blue" position={Position.Right} style={{ top: '59%' }} />
    <OutputHandle id="alpha" position={Position.Right} style={{ top: '76%' }} />
  </>;
}

export default SplitChannelsNode;
