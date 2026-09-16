import SolidChip from '@/components/SolidChip';
import ExtendedMenu from '@/middleware/tools/PopoverTools/ExtendedMenu';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { PartyPopper } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function StartPart() {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ExtendedMenu />
      <img
        src="./couchLogoMini.png"
        alt={t('logoAlt')}
        width={45}
        height={30}
        style={{ width: 45, height: 30, filter: 'hue-rotate(250deg)' }}
        fetchPriority="high"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <Typography color="textSecondary" sx={{ letterSpacing: -1,  fontSize: 17, lineHeight: 1 }}>Couch</Typography>
            <Typography color="primary" sx={{ fontSize: 17, letterSpacing: -1, lineHeight: 1, fontWeight: 'bold', }}>Editor</Typography>
          </Box>
          <SolidChip label={t('beta')} variant="important" />
        </Box>
        <Typography variant="caption" color="textDisabled" sx={{ lineHeight: 1, letterSpacing: -0.35, }}>{t('headerTagline')}</Typography>
      </Box>
      <Tooltip title={'Share feedback with the developer'} arrow>
        <a href="https://github.com/travel-albums-ai/CouchEditor/issues/new?template=general-feedback.yml" target="_blank" rel="noopener noreferrer">
          <Button color="secondary" sx={{ minWidth: 'unset' }} >
            <PartyPopper  />
          </Button>
        </a>
      </Tooltip>
    </Box>
  );
}
