import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Box, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { Combine } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const INPUTS = [
  { id: 'image-1', number: 1 },
  { id: 'image-2', number: 2 },
  { id: 'image-3', number: 3 },
  { id: 'image-4', number: 4 },
];

function GrouperNode(_props: NodeProps<Node>) {
  const { t } = useTranslation();

  return <>
    {INPUTS.map((input, index) => (
      <InputHandle
        key={input.id}
        id={input.id}
        style={{ top: `${29 + index * 14}%` }}
      />
    ))}

    <NodeWrapper title={t('pipelineGrouper')} icon={<Combine />} toolbar={<></>} type="grouper">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {INPUTS.map((input) => (
          <Typography key={input.id} variant="caption" sx={{ lineHeight: 2.4 }}>{t('pipelinePhotoArray', { number: input.number })}</Typography>
        ))}
      </Box>
      <small>{t('pipelineGrouperDescription')}</small>
    </NodeWrapper>
    <OutputHandle id="image" position={Position.Right} />
  </>;
}

export default GrouperNode;
