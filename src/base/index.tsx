import DomCountStatus from '@/base/DomCountStatus';
import KeyboardMenu from '@/base/KeyboardMenu';
import PipelineNodeCountStatus from '@/base/PipelineNodeCountStatus';
import PipelineTotalTimeStatus from '@/base/PipelineTotalTimeStatus';
import RenderingProgress from '@/base/RenderingProgress';
import VersionStatus from '@/base/VersionStatus';
import {
  Box,
  Divider,
  Stack
} from '@mui/material';

export default function StatusBar() {

  return <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 1 }}>
    <RenderingProgress />
    <Stack sx={{ ...wrapperSx, width: '100%' }} direction="row" id="header">
      <Stack direction="row" data-side="left" divider={<Divider orientation="vertical" flexItem />} sx={{ display: 'flex', flex: 1, gap: 1, alignItems: 'center' }}>
        <PipelineNodeCountStatus />
        <PipelineTotalTimeStatus />
      </Stack>
      <Stack direction="row" data-side="right" divider={<Divider orientation="vertical" flexItem />} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <DomCountStatus />
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
