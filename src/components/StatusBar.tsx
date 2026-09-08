import DomCountStatus from '@/middleware/base/DomCountStatus';
import KeyboardMenu from '@/middleware/base/KeyboardMenu';
import PipelineNodeCountStatus from '@/middleware/base/PipelineNodeCountStatus';
import PipelineTotalTimeStatus from '@/middleware/base/PipelineTotalTimeStatus';
import VersionStatus from '@/middleware/base/VersionStatus';
import {
  Divider,
  Stack
} from '@mui/material';

export default function StatusBar() {
  return <>
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
  </>
}

const wrapperSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'auto',
  gap: 1,
}
