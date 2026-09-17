import LoadingBar from '@/components/LoadingBar';
import StatusBar from '@/components/StatusBar';
import { TOOLBAR_GAP } from '@/layout';
import DeleteButton from '@/middleware/windows/pipeline/components/DeleteButton';
import FloatingToolbar from '@/middleware/windows/pipeline/components/FloatingToolbar';
import AppName from '@/toolbars/tools/AppName';
import DarkLightStatus from '@/toolbars/tools/DarkLightStatus';
import ExtendedMenu from '@/toolbars/tools/ExtendedMenu';
import FullscreenToggle from '@/toolbars/tools/FullscreenToggle';
import HelpToggle from '@/toolbars/tools/HelpToggle';
import Logo from '@/toolbars/tools/Logo';
import NewUploadToggle from '@/toolbars/tools/NewUploadToggle';
import PipelineName from '@/toolbars/tools/PipelineName';
import PointerReactflowToggle from '@/toolbars/tools/PointerReactflowToggle';
import SaveCloneUploadToggle from '@/toolbars/tools/SaveCloneUploadToggle';
import SettingsWindowToggle from '@/toolbars/tools/SettingsWindowToggle';
import ShareFeedback from '@/toolbars/tools/ShareFeedback';
import TemplatesToggle from '@/toolbars/tools/TemplatesToggle';
import ToggleToolbox from '@/toolbars/tools/ToggleToolbox';
import TutorialToggle from '@/toolbars/tools/TutorialToggle';
import ViewerReactflowToggle from '@/toolbars/tools/ViewerReactflowToggle';
import { Box, Divider } from '@mui/material';

export default function Toolbars() {

  const toolbarItems = {
    'toolbox': {
      sx: { bottom: 0, left: TOOLBAR_GAP, top: 0, overflow: 'visible', justifyContent: 'center', alignItems: 'center' },
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
      sx: { bottom: TOOLBAR_GAP, left: '0%', right: '0%', overflow: 'auto', justifyContent: 'center' },
      floatingSx: { minWidth: '900px', maxWidth: '1200px' },
      groups: [
        <>
          <LoadingBar />
          <StatusBar />
        </>,
      ],
    },
    'others': {
      sx: { top: TOOLBAR_GAP, right: TOOLBAR_GAP, overflow: 'auto', justifyContent: 'center' },
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
      sx: { left: TOOLBAR_GAP, top: TOOLBAR_GAP, overflow: 'visible', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', maxWidth: '70%' },
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
      {Object.entries(toolbarItems).map(([key, { sx, floatingSx, groups }]) => (
        <Box key={key} sx={{...sx, position: 'absolute', display: 'flex'}} id={`toolbar-${key}`}>
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
