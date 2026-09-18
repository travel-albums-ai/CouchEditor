import SolidChip from '@/components/SolidChip';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function AppName() {
  const { t } = useTranslation()

  return <>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box aria-label="Application name" sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <Typography color="textSecondary" sx={{ letterSpacing: -1,  fontSize: 17, lineHeight: 1 }}>Couch</Typography>
          <Typography color="primary" sx={{ fontSize: 17, letterSpacing: -1, lineHeight: 1, fontWeight: 'bold', }}>Editor</Typography>
        </Box>
        <SolidChip label={t('beta')} ariaLabel="Version status" variant="important" />
      </Box>
      <Typography variant="caption" color="textDisabled" sx={{ lineHeight: 1, letterSpacing: -0.35, }}>{t('headerTagline')}</Typography>
    </Box>
  </>
}
