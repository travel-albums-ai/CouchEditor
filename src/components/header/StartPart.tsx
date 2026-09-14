import SolidChip from '@/components/SolidChip';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function StartPart() {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            <Typography sx={{ color: 'primary.main', letterSpacing: -1, fontWeight: 'bold', fontSize: 17, lineHeight: 1 }}>Couch</Typography>
            <Typography color="textSecondary" sx={{ fontSize: 17, letterSpacing: -1, lineHeight: 1 }}>Editor</Typography>
          </Box>
          <SolidChip label={t('beta')} variant="header" />
        </Box>
        <Typography variant="caption" color="textDisabled" sx={{ lineHeight: 1, letterSpacing: -0.35, }}>{t('headerTagline')}</Typography>
      </Box>
    </Box>
  );
}
