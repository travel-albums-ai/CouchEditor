import { Button, Tooltip } from '@mui/material';
import { PartyPopper } from 'lucide-react';

export default function ShareFeedback() {

  return <>
    <Tooltip title={'Share feedback with the developer'} arrow>
      <a href="https://github.com/travel-albums-ai/CouchEditor/issues/new?template=general-feedback.yml" target="_blank" rel="noopener noreferrer">
        <Button color="secondary" sx={{ minWidth: 'unset' }} >
          <PartyPopper  />
        </Button>
      </a>
    </Tooltip>
  </>
}
