import AiLoadingBar from '@/components/AiLoadingBar';
import LoadingBar from '@/components/LoadingBar';
import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import GeneralRegistryWindow from '@/components/registry/GeneralRegistryWindow';
import MainDriver from '@/components/tutorial/MainDriver';
import ReactFlowWrapper from '@/middleware/windows/pipeline/ReactFlowWrapper';
import Box from '@mui/material/Box';
import { Theme } from '@mui/material/styles';

export default function AppLayout() {

  return (
    <>
      <GeneralRegistryWindow />
      <MainDriver />
      <AiLoadingBar />
      <ReactFlowWrapper />

      <Box
        id="status-bar"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1.5,
          px: 0.75,
          pl: 1.25,
          height: '28px',
          bgcolor: 'background.default',
          position: 'relative',
          borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <LoadingBar />

        <GeneralRegistryToolbar
          noGhost
          noDivider={false}
          group="status-bar"
        />
      </Box>
    </>
  );
}
