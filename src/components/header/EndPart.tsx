import DarkLightStatus from '@/middleware/tools/ActionTools/DarkLightStatus';
import FullscreenToggle from '@/middleware/tools/ActionTools/FullscreenToggle';
import HelpToggle from '@/middleware/tools/ActionTools/HelpToggle';
import SettingsWindowToggle from '@/middleware/tools/ActionTools/SettingsWindowToggle';
import TutorialToggle from '@/middleware/tools/ActionTools/TutorialToggle';
import ExtendedMenu from '@/middleware/tools/PopoverTools/ExtendedMenu';
import { Box } from '@mui/material';

export default function EndPart() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
      <SettingsWindowToggle />
      <DarkLightStatus />
      <FullscreenToggle />
      <TutorialToggle />
      <HelpToggle />
      <ExtendedMenu />
    </Box>
  );
}
