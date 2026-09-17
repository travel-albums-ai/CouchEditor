import DarkLightStatus from '@/middleware/tools/DarkLightStatus';
import FullscreenToggle from '@/middleware/tools/FullscreenToggle';
import SettingsWindowToggle from '@/middleware/tools/SettingsWindowToggle';
import TutorialToggle from '@/middleware/tools/TutorialToggle';
import { Box } from '@mui/material';

export default function EndPart() {

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
        <SettingsWindowToggle />

        <DarkLightStatus />
        <FullscreenToggle />
        <TutorialToggle />


      </Box>
    </>
  );
}
