import DomCounter from '@/base/DomCounter';
import KeyboardMenu from '@/base/KeyboardMenu';
import PipelineCacheMemory from '@/base/PipelineCacheMemory';
import PipelineNodeCounter from '@/base/PipelineNodeCounter';
import PipelineTotalTime from '@/base/PipelineTotalTime';
import RenderingProgressBars from '@/base/RenderingProgressBars';
import VersionStatus from '@/base/VersionStatus';
import FloatingToolbar from '@/components/FloatingToolbar';
import { TOOLBAR_GAP } from '@/lib/utils';
import AppName from '@/toolbars/tools/AppName';
import DarkLightStatus from '@/toolbars/tools/DarkLightStatus';
import DeleteButton from '@/toolbars/tools/DeleteButton';
import ExtendedMenu from '@/toolbars/tools/ExtendedMenu';
import FitViewButton from '@/toolbars/tools/FitViewButton';
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
import ZoomInButton from '@/toolbars/tools/ZoomInButton';
import ZoomLevel from '@/toolbars/tools/ZoomLevel';
import ZoomOutButton from '@/toolbars/tools/ZoomOutButton';
import ZoomTo100Button from '@/toolbars/tools/ZoomTo100Button';
import { Box, Divider } from '@mui/material';

type ToolbarItem = {
  sx: Record<string, any>;
  floatingSx?: Record<string, any>;
  groups: React.ReactNode[];
};

export default function Toolbars() {

  const toolbarItems = {
    'toolbox': {
      sx: { bottom: 0, left: TOOLBAR_GAP, top: 0, overflow: 'visible', justifyContent: 'center', alignItems: 'center' },
      floatingSx: { },
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
      sx: { bottom: TOOLBAR_GAP * 1.5, left: TOOLBAR_GAP, right: TOOLBAR_GAP, overflow: 'auto', justifyContent: 'center', flexWrap: 'wrap' },
      floatingSx: {  },
      groups: [
        <>
          <PipelineNodeCounter />
          <PipelineTotalTime />
          <PipelineCacheMemory />
        </>,
        <>
          <DomCounter />
          <KeyboardMenu />
          <VersionStatus />
        </>,
      ],
    },
    'loadingBars': {
      sx: { top: 0, left: '0%', right: '0%', overflow: 'auto', justifyContent: 'center' },
      floatingSx: { width: '100%', border: 'unset', p: 0, m: 0 },
      groups: [
        <>
          <RenderingProgressBars />
        </>,
      ],
    },
    'others': {
      sx: { top: TOOLBAR_GAP, right: TOOLBAR_GAP, overflow: 'auto', justifyContent: 'center' },
      floatingSx: { },
      groups: [
        <>
          <ZoomOutButton />
          <ZoomLevel />
          <ZoomInButton />
          <FitViewButton />
          <ZoomTo100Button />
        </>,
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
      floatingSx: { },
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
  } satisfies Record<string, ToolbarItem>;

  return (
    <>
      {Object.entries(toolbarItems).map(([key, item]) => (
        <Box key={key} sx={{...item.sx, position: 'absolute', display: 'flex'}} id={`toolbar-${key}`}>
          {item.groups && item.groups.map((group, index) => (
            <FloatingToolbar key={index} sx={item.floatingSx as any}>
              {group}
            </FloatingToolbar>
          ))}
        </Box>
      ))}
    </>
  );
}
