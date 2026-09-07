import { Box, Typography } from '@mui/material';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NoServer() {
  const { t } = useTranslation();

  return (<>
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      py: 4,
    }}>
      <TriangleAlert size={60} color="orange"  />
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('noServerConnectionTitle')}</Typography>
      <Typography variant="body1" align="center" sx={{ px: 4 }} color="textSecondary">
        {t('noServerConnectionBody')}
      </Typography>
    </Box>
  </>)
}
