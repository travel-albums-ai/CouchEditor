import DomCounter from '@/base/DomCounter';
import KeyboardMenu from '@/base/KeyboardMenu';
import PipelineCacheMemory from '@/base/PipelineCacheMemory';
import PipelineNodeCounter from '@/base/PipelineNodeCounter';
import PipelineTotalTime from '@/base/PipelineTotalTime';
import RenderingProgressBars from '@/base/RenderingProgressBars';
import VersionStatus from '@/base/VersionStatus';
import {
  Box,
  Divider,
  Stack
} from '@mui/material';

export default function StatusBar() {

  return <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 1 }}>
    <RenderingProgressBars />
    <Stack sx={{ ...wrapperSx, width: '100%' }} direction="row" id="header">
      <Stack direction="row" data-side="left" divider={<Divider orientation="vertical" flexItem />} sx={{ display: 'flex', flex: 1, gap: 1, alignItems: 'center' }}>
        <PipelineNodeCounter />
        <PipelineTotalTime />
        <PipelineCacheMemory />
      </Stack>
      <Stack direction="row" data-side="right" divider={<Divider orientation="vertical" flexItem />} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <DomCounter />
        <KeyboardMenu />
        <VersionStatus />
      </Stack>
    </Stack>
  </Box>
}

const wrapperSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'auto',
  gap: 1,
}
