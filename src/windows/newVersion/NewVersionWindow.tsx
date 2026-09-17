import { useSettings } from '@/context/settingsStore';
import { Box, Button, Typography } from '@mui/material';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NewVersion() {
  const { setSetting } = useSettings()
  const { t } = useTranslation()

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      py: 4,
    }}>
      <Sparkles size={60} color="green" />
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('newVersionAvailableTitle')}</Typography>
      <Typography variant="body1" align="center" sx={{ px: 4 }} color="textSecondary">
        {t('newVersionAvailableBody')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            try { (window as any).__WORKBOX?.messageSW({ type: 'SKIP_WAITING' }) } catch {}
            setSetting((prev: any) => ({ ...prev, newVersion: false }))
          }}
        >
          {t('updateNow')}
        </Button>

        <Button
          variant="text"
          onClick={() => setSetting((prev: any) => ({ ...prev, newVersion: false }))}
        >
          {t('later')}
        </Button>
      </Box>
    </Box>
  )
}
