import DarkLightStatus from '@/middleware/tools/ActionTools/DarkLightStatus';
import FullscreenToggle from '@/middleware/tools/ActionTools/FullscreenToggle';
import HelpToggle from '@/middleware/tools/ActionTools/HelpToggle';
import SettingsWindowToggle from '@/middleware/tools/ActionTools/SettingsWindowToggle';
import TutorialToggle from '@/middleware/tools/ActionTools/TutorialToggle';
import ExtendedMenu from '@/middleware/tools/PopoverTools/ExtendedMenu';
import { Box, Button } from '@mui/material';
import { Bug } from 'lucide-react';

export default function EndPart() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
      <a href="https://github.com/travel-albums-ai/CouchEditor/issues/new" target="_blank" rel="noopener noreferrer">
        <Button variant="outlined" startIcon={<Bug size={16} />} color="primary">
          Open an issue
        </Button>
      </a>

      <SettingsWindowToggle />
      <DarkLightStatus />
      <FullscreenToggle />
      <TutorialToggle />
      <HelpToggle />
      <ExtendedMenu />
    </Box>
  );
}
