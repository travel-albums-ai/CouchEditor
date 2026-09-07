import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { Dialog } from '@mui/material';
import LightboxWindowInner from './lightbox/LightboxWindow';

export default function LightboxWindow() {
  const lightboxOpen = useSettingsStoreSelector(s => s.lightboxOpen);
  const { setSetting } = useSettings();

  const showWindow = lightboxOpen === true;

  if (!showWindow) return null

  return (
    <Dialog
      fullWidth
      fullScreen
      open={showWindow}
      onClose={() => setSetting(prev => ({ ...prev, lightboxOpen: false}))}
      slotProps={{
        paper: {
          sx: {
            width: '95vw',
            height: '95vh',
            maxHeight: '95vh',
            maxWidth: '95vw',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            p: 0,
          }}}}
    >
      <LightboxWindowInner />
    </Dialog>
  )
}
