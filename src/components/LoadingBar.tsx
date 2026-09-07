import { useSettingsStoreSelector } from '@/context/settingsStore';
import { LinearProgress } from '@mui/material';

export default function LoadingBar() {
  const loading = useSettingsStoreSelector((state) => state.loading);
  const loadingValue = useSettingsStoreSelector((state) => state.loadingValue);

  return (
    <>
      {loading && loadingValue === null && <>
        <LinearProgress variant="indeterminate" sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, opacity: 0.5 }} />
        <LinearProgress variant="indeterminate" sx={{ position: 'absolute', top: 2, left: 0, right: 0, height: 24, opacity: 0.05, pointerEvents: 'none' }} />
      </>}
    </>
  )
}
