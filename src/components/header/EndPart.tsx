import DarkLightStatus from '@/middleware/tools/ActionTools/DarkLightStatus';
import FullscreenToggle from '@/middleware/tools/ActionTools/FullscreenToggle';
import HelpToggle from '@/middleware/tools/ActionTools/HelpToggle';
import SettingsWindowToggle from '@/middleware/tools/ActionTools/SettingsWindowToggle';
import TutorialToggle from '@/middleware/tools/ActionTools/TutorialToggle';
import ExtendedMenu from '@/middleware/tools/PopoverTools/ExtendedMenu';
import { Box, Button, Tooltip } from '@mui/material';
import { Bug, Home, Lightbulb } from 'lucide-react';

export default function EndPart() {

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
        <SettingsWindowToggle />


        <DarkLightStatus />
        <FullscreenToggle />
        <TutorialToggle />
        <HelpToggle />

        <Tooltip title={'Visit the homepage of the application.'} arrow>
          <a href="http://homepage.couch-editor.com/" target="_blank" rel="noopener noreferrer">
            <Button variant="text" sx={{ minWidth: 0, px: 0.75, color: 'text.primary' }}>
              <Home size={16} style={{ margin: 5 }} />
            </Button>
          </a>
        </Tooltip>
        <Tooltip title={'Report a bug. Please provide detailed information.'} arrow>
          <a href="https://github.com/travel-albums-ai/CouchEditor/issues/new?template=bug-existing-feature.yml" target="_blank" rel="noopener noreferrer">
            <Button variant="text" sx={{ minWidth: 0, px: 0.75, color: 'text.primary' }}>
              <Bug size={16} style={{ margin: 5 }} />
            </Button>
          </a>
        </Tooltip>
        <Tooltip title={'Propose a new component. Please provide detailed information and your use case.'} arrow>
          <a href="https://github.com/travel-albums-ai/CouchEditor/issues/new?template=new-field.yml" target="_blank" rel="noopener noreferrer">
            <Button variant="text" sx={{ minWidth: 0, px: 0.75, color: 'text.primary' }}>
              <Lightbulb size={16} style={{ margin: 5 }} />
            </Button>
          </a>
        </Tooltip>

        <ExtendedMenu />
      </Box>
    </>
  );
}
