import { Button, Tooltip } from '@mui/material';
import { PartyPopper } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ShareFeedback() {
  const { t } = useTranslation();

  return <>
    <Tooltip title={t('shareFeedbackTooltip')} arrow>
      <a href="https://github.com/travel-albums-ai/CouchEditor/issues/new?template=general-feedback.yml" target="_blank" rel="noopener noreferrer">
        <Button color="secondary" aria-label="Share Feedback" sx={{ minWidth: 'unset' }} >
          <PartyPopper  />
        </Button>
      </a>
    </Tooltip>
  </>
}
