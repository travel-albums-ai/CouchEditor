import DarkLightStatus from '@/middleware/tools/ActionTools/DarkLightStatus';
import FullscreenToggle from '@/middleware/tools/ActionTools/FullscreenToggle';
import HelpToggle from '@/middleware/tools/ActionTools/HelpToggle';
import SettingsWindowToggle from '@/middleware/tools/ActionTools/SettingsWindowToggle';
import TutorialToggle from '@/middleware/tools/ActionTools/TutorialToggle';
import ExtendedMenu from '@/middleware/tools/PopoverTools/ExtendedMenu';
import { Box, Button, Tooltip } from '@mui/material';
import { Bug, Lightbulb } from 'lucide-react';

export default function EndPart() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
      <Tooltip title={'Report a bug. Please provide detailed information.'} arrow>
        <a href="https://github.com/travel-albums-ai/CouchEditor/issues/new?template=bug-existing-feature.yml" target="_blank" rel="noopener noreferrer">
          <Button variant="outlined" startIcon={<Bug size={16} />} color="primary">
            Open an issue
          </Button>
        </a>
      </Tooltip>
      <Tooltip title={'Propose a new component. Please provide detailed information and your use case.'} arrow>
        <a href="https://github.com/travel-albums-ai/CouchEditor/issues/new?template=new-field.yml" target="_blank" rel="noopener noreferrer">
          <Button variant="outlined" startIcon={<Lightbulb size={16} />} color="primary">
            Propose component
          </Button>
        </a>
      </Tooltip>

      <SettingsWindowToggle />
      <DarkLightStatus />
      <FullscreenToggle />
      <TutorialToggle />
      <HelpToggle />
      <ExtendedMenu />
    </Box>
  );
}
