import LoadingBar from '@/components/LoadingBar';
import StatusBar from '@/components/StatusBar';
import { TOOLBAR_GAP } from '@/layout';
import AppName from '@/middleware/tools/AppName';
import DarkLightStatus from '@/middleware/tools/DarkLightStatus';
import ExtendedMenu from '@/middleware/tools/ExtendedMenu';
import FullscreenToggle from '@/middleware/tools/FullscreenToggle';
import HelpToggle from '@/middleware/tools/HelpToggle';
import Logo from '@/middleware/tools/Logo';
import NewUploadToggle from '@/middleware/tools/NewUploadToggle';
import PipelineName from '@/middleware/tools/PipelineName';
import PointerReactflowToggle from '@/middleware/tools/PointerReactflowToggle';
import SaveCloneUploadToggle from '@/middleware/tools/SaveCloneUploadToggle';
import SettingsWindowToggle from '@/middleware/tools/SettingsWindowToggle';
import ShareFeedback from '@/middleware/tools/ShareFeedback';
import TemplatesToggle from '@/middleware/tools/TemplatesToggle';
import ToggleToolbox from '@/middleware/tools/ToggleToolbox';
import TutorialToggle from '@/middleware/tools/TutorialToggle';
import ViewerReactflowToggle from '@/middleware/tools/ViewerReactflowToggle';
import DeleteButton from '@/middleware/windows/pipeline/components/DeleteButton';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import { Box, Divider } from '@mui/material';

export default function Toolbars() {

  const toolbarItems = {
    'toolbox': {
      sx: { bottom: 0, left: TOOLBAR_GAP, top: 0, overflow: 'visible', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center' },
      groups: [
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, position: 'relative' }}>
          <PointerReactflowToggle />
          <ViewerReactflowToggle />
          <Divider />
          <HelpToggle />
          <Divider />
          <TemplatesToggle />
          <ToggleToolbox />
          <Divider />
          <DeleteButton />
        </Box>
      ]
    },
    'status': {
      sx: { bottom: TOOLBAR_GAP, left: '0%', right: '0%', overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center' },
      floatingSx: { minWidth: '900px', maxWidth: '1200px' },
      groups: [
        <>
          <LoadingBar />
          <StatusBar />
        </>,
      ],
    },
    'others': {
      sx: { top: TOOLBAR_GAP, right: TOOLBAR_GAP, overflow: 'auto', position: 'absolute', display: 'flex', justifyContent: 'center' },
      groups: [
        <>
          <SettingsWindowToggle />
          <DarkLightStatus />
          <FullscreenToggle />
          <TutorialToggle />
        </>,
      ],
    },
    'start': {
      sx: { left: TOOLBAR_GAP, top: TOOLBAR_GAP, overflow: 'visible', position: 'absolute', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', maxWidth: '70%' },
      groups: [
        <>
          <ExtendedMenu />
          <Logo />
          <AppName />
          <ShareFeedback />
        </>,
        <>
          <NewUploadToggle />
          <PipelineName />
          <SaveCloneUploadToggle />
        </>,
      ],
    },
  };

  return (
    <>
      {Object.entries(toolbarItems).map(([key, { sx, components, floatingSx, groups }]) => (
        <Box key={key} sx={sx} id={`toolbar-${key}`}>
          {groups && groups.map((group, index) => (
            <FloatingToolbar key={index} sx={floatingSx}>
              {group}
            </FloatingToolbar>
          ))}
        </Box>
      ))}
    </>
  );
}
