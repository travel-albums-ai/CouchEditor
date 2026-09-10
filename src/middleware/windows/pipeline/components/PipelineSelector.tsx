import { Box, FormControl, MenuItem, Select } from '@mui/material';

import type { SavedPipeline } from '@/context/pipelineStore';
import { MinimapPipeline } from './MinimapPipeline';

type PipelineSelectorProps = {
  currentPipelineId: string;
  pipelines: SavedPipeline[];
  loadPipeline: (id: string) => void;
};

export default function PipelineSelector({
  currentPipelineId,
  pipelines,
  loadPipeline,
}: PipelineSelectorProps) {
  return (
    <FormControl id="pipeline-loader" size="small" sx={{ minWidth: 250 }}>
      <Select
        size="small"
        value={currentPipelineId}
        displayEmpty
        sx={{ height: 36, border: 0, borderColor: 'transparent' }}
        onChange={(event) => loadPipeline(event.target.value)}
        renderValue={(value) => value
          ? pipelines.find((pipeline) => pipeline.id === value)?.name ?? 'Pipeline'
          : 'Load pipeline'}
        aria-label="Load pipeline"
      >
        <MenuItem value="" disabled>Load pipeline</MenuItem>
        {pipelines.map((pipeline) => (
          <MenuItem key={pipeline.id} value={pipeline.id}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
              <MinimapPipeline pipeline={pipeline} />
              {pipeline.name}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
