import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { Box, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { Combine } from 'lucide-react';

const INPUTS = [
  { id: 'image-1', label: 'Photo array 1' },
  { id: 'image-2', label: 'Photo array 2' },
  { id: 'image-3', label: 'Photo array 3' },
  { id: 'image-4', label: 'Photo array 4' },
];

function GrouperNode(_props: NodeProps<Node>) {
  return <>
    {INPUTS.map((input, index) => (
      <InputHandle
        key={input.id}
        id={input.id}
        style={{ top: `${29 + index * 15}%` }}
      />
    ))}

    <NodeWrapper title={'Grouper'} icon={<Combine />} toolbar={<></>} type="grouper">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {INPUTS.map((input) => (
          <Typography key={input.id} variant="caption" sx={{ lineHeight: 2.2 }}>{input.label}</Typography>
        ))}
      </Box>
      <small>Merges up to four connected photo arrays</small>
    </NodeWrapper>
    <OutputHandle id="image" position={Position.Right} />
  </>;
}

export default GrouperNode;
