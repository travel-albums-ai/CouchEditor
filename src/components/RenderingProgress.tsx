import { usePipelineStore } from '@/context/pipelineStore';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import {
  Box
} from '@mui/material';

export default function RenderingProgress() {
  const {
    currentPipeline,
  } = usePipelineStore();


  return <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, p: 2 }}>
      {currentPipeline?.nodes.map(node => (
        <Box key={node.id}>
          <PipelineStageTiming nodeId={node.id} nodeType={node.type} />
        </Box>
      ))}
    </Box>

  </Box>
}
