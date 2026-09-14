import { Box } from '@mui/material';

import EndPart from '@/components/header/EndPart';
import MiddlePart from '@/components/header/MiddlePart';
import StartPart from '@/components/header/StartPart';
import type { SavedPipeline } from '@/context/pipelineStore';

type HeaderProps = {
  currentPipelineId: string;
  pipelines: SavedPipeline[];
  loadPipeline: (id: string) => void;
};

export default function Header({ currentPipelineId, pipelines, loadPipeline }: HeaderProps) {

  return (
    <Box sx={{
      px: 2, pr: 1.5, py: 1.5,
      bgcolor: 'background.paper', display: 'flex', flexDirection: 'row',
      justifyContent: 'space-between',
      boxShadow: theme => `0px 4px 4px -2px ${theme.palette.divider}`,
      zIndex: 10
    }}>
      <StartPart />
      <MiddlePart
        currentPipelineId={currentPipelineId}
        pipelines={pipelines}
        loadPipeline={loadPipeline}
      />
      <EndPart />
    </Box>
  );
}
