import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_Health } from '@/hooks/remote/useFetch_Health';
import { Box, Tooltip } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ServerStatus() {
  const { data, error, isError, isFetching } = useFetch_Health()
  const { setSetting } = useSettings();
  const serverOnline = useSettingsStoreSelector((s) => s.serverOnline)
  const { t } = useTranslation();

  useEffect(() => {
    if (isError) {
      if (serverOnline !== false) {
        setSetting((prev) => ({ ...prev, serverOnline: false }));
      }
      return;
    }

    if (data && serverOnline !== true) {
      setSetting((prev) => ({ ...prev, serverOnline: true }));
    }
  }, [data, isError, serverOnline, setSetting]);

  const tooltip = isError ? `Error: ${String(error)}` : isFetching ? t('serverChecking') : t('serverHealthStatus')

  return (<>
    <Tooltip title={tooltip} arrow>
      <Box sx={{
        borderRadius: '50%',
        width: 10,
        height: 10,
        backgroundColor: isError ? 'error.main' : data ? 'success.main' : 'warning.main',
        opacity: isFetching ? 0.5 : 1,
        transition: 'background-color 0.3s ease, opacity 0.3s ease',
      }} />
    </Tooltip>
  </>)
}
