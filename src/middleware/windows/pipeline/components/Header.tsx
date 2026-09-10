import { alpha, Box, Typography, useTheme } from '@mui/material';
import { GalleryHorizontalEnd, Users2, Workflow } from 'lucide-react';

import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import SolidChip from '@/components/SolidChip';
import type { SavedPipeline } from '@/context/pipelineStore';
import PipelineSelector from './PipelineSelector';

type HeaderProps = {
  currentPipelineId: string;
  pipelines: SavedPipeline[];
  loadPipeline: (id: string) => void;
};

export default function Header({ currentPipelineId, pipelines, loadPipeline }: HeaderProps) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 2, py: 1.5, bgcolor: 'background.paper', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
      boxShadow: theme => `0px 4px 6px ${theme.palette.divider}`,
      zIndex: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <img
          src="./couchLogoMini.png"
          alt="Logo"
          width={45}
          height={30}
          style={{ width: 45, height: 30 }}
          fetchPriority="high"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 17, lineHeight: 1 }}>Couch Editor</Typography>
            <SolidChip label="Beta" />
          </Box>
          <Typography variant="caption" >Drag. Slide. See.</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.disabled', borderRadius: 2, p: 2, height: 42, bgcolor: 'transparent',
          border: 1,
          borderColor: alpha(theme.palette.divider, 0.3),

        }}>
          <Workflow size={16} />
          <Typography variant="subtitle2">Editor</Typography>
        </Box>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', borderRadius: 2, p: 2, height: 42,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          border: 1,
          borderColor: alpha(theme.palette.primary.main, 0.3),
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          },
        }}>
          <GalleryHorizontalEnd size={16} />
          <Typography variant="subtitle2" sx={{ mr: 2 }}>Templates</Typography>
          <PipelineSelector
            currentPipelineId={currentPipelineId}
            pipelines={pipelines}
            loadPipeline={loadPipeline}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main', borderRadius: 2, p: 2, height: 42,
          bgcolor: alpha(theme.palette.secondary.main, 0.15),
          border: 1,
          borderColor: alpha(theme.palette.secondary.main, 0.3),
          '&:hover': {
            bgcolor: alpha(theme.palette.secondary.main, 0.2),
          },

        }}>
          <Users2 size={16} />
          <Typography variant="subtitle2">Community</Typography>
          <Box sx={{ color: 'text.primary'}}>
            <SolidChip label="Coming soon..." />
          </Box>
        </Box>
      </Box>
      <GeneralRegistryToolbar
        fullWidth={false}
        noGhost={true}
        group="header"
      />
    </Box>
  );
}
