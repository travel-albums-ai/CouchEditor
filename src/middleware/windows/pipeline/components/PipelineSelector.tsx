import { alpha, Box, ButtonBase, Chip, Popover, TextField, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

import type { SavedPipeline } from '@/context/pipelineStore';
import PipelineSelectorItem from '@/middleware/windows/pipeline/components/PipelineSelectorItem';
import PipelineSelectorItems from '@/middleware/windows/pipeline/components/PipelineSelectorItems';
import { Astroid, Camera, ChevronsDown, GalleryHorizontalEnd, User } from 'lucide-react';

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selectedPipeline = pipelines.find((pipeline) => pipeline.id === currentPipelineId);
  const isOpen = Boolean(anchorEl);
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState('all');

  const handleSelect = (pipelineId: string) => {
    loadPipeline(pipelineId);
    setAnchorEl(null);
  };

  const pipelineGroupings = [
    {
      name: 'Sample & Starters',
      description: "Ready to use pipelines for common workflows",
      icon: <Astroid />,
      type: 'sample',
      data: pipelines
        .filter(p => p.type === 'sample')
    },
    {
      type: 'instagram',
      name: 'Instagram-like Inspirations',
      description: "Pipelines inspired by Instagram's style",
      icon: <Camera />,
      data: pipelines
        .filter(p => p.type === 'instagram')
    },
    {
      type: 'user',
      name: 'User-Created Pipelines',
      description: "Pipelines created by users",
      icon: <User />,
      data: pipelines
        .filter(p => p.type === 'user')
    }
  ]

  const chips = [
    {
      label: 'All', value: 'all'
    },
    {
      label: 'Sample', value: 'sample'
    },
    {
      label: 'Instagram', value: 'instagram'
    },
    {
      label: 'User', value: 'user'
    },
  ]

  return (
    <>
      <ButtonBase
        aria-label="Load pipeline"
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          height: 30,
          border: '1px solid',
          borderColor: theme => alpha(theme.palette.primary.main, 0.4),
          minWidth: 250,
          justifyContent: 'flex-start',
          px: 1,
          borderRadius: 1,
          color: 'inherit',
          typography: 'body2',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', flex: 1 }}>
          {selectedPipeline?.name ?? 'Load pipeline'}
          <ChevronsDown size={16} />
        </Box>
      </ButtonBase>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxHeight: '60vh',
            width: '850px',
            overflowY: 'hidden',
          }}
        >
          <Box sx={{ position: 'relative',
            backgroundImage: 'url(couceditor_header_background_850px.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',

          }}>
            <Box sx={{ py: 5, pl: 4, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', }}>
              <GalleryHorizontalEnd  size={64} color={theme.palette.primary.main} />
              <Box sx={{ borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography color="textPrimary" variant="h6">Pipeline Templates</Typography>
                <Typography color="textSecondary" variant="caption" sx={{ whiteSpace: 'wrap', width: '400px', display: 'block' }}>Kickstart your work with ready-made templates, and save time on repetitive tasks. Pick a template, customize it, and make it your own.</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1, justifyContent: 'space-between', px: 2, py: 1 }}>
            <TextField
              autoFocus
              color="primary"
              variant="outlined"
              size="small"
              placeholder="Search pipelines..."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              sx={{ flex: 1 }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              {chips.map((chip) => (
                <Chip
                  key={chip.value}
                  label={chip.label}
                  color={selectedView === chip.value ? 'primary' : 'default'}
                  onClick={() => setSelectedView(chip.value)}
                  variant={selectedView === chip.value ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ overflowY: 'auto', }}>
            {pipelineGroupings
              .filter((grouping) => selectedView === 'all' || grouping.type === selectedView)
              .filter((grouping) => grouping.data.some((pipeline) => pipeline.name.toLowerCase().includes(searchQuery.toLowerCase())))
              .map((grouping) => (
                <PipelineSelectorItems
                  key={grouping.name}
                  title={grouping.name}
                  icon={grouping.icon}
                  description={grouping.description}
                  isSelected={grouping.type === selectedView}
                  onClick={() => setSelectedView(grouping.type)}
                >
                  {grouping.data
                    .filter((pipeline) => pipeline.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .filter((_, index) => grouping.type !== selectedView ? index < 9 : true)
                    .map((pipeline) => (
                      <PipelineSelectorItem pipeline={pipeline} onClick={() => handleSelect(pipeline.id)} key={pipeline.id} />
                    ))}
                </PipelineSelectorItems>
              ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
}
