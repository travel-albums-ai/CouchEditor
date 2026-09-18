import DialogCloseButton from '@/components/DialogCloseButton';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import Settings from '@/windows/settings';
import { Dialog } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function SettingsWindow() {
  const showSettings = useSettingsStoreSelector(s => s.showSettings)
  const { setSetting } = useSettings()
  const { t } = useTranslation();

  const showWindow = showSettings === true

  if (!showWindow) return null

  return (
    <Dialog
      id="settings-window"
      fullWidth
      maxWidth="xl"
      open={showWindow}
      onClose={() => setSetting(prev => ({ ...prev, showSettings: false }))}
      slotProps={{
        paper: {
          sx: {
            width: 1200,
            height: 850,
            maxWidth: 'none',
            maxHeight: 'none',
            position: 'relative',
            overflow: 'visible',
            display: 'flex',
            gap: 2,
          },
        },
      }}
    >
      <DialogCloseButton
        title={t('closeSettings')}
        onClick={() => setSetting(prev => ({ ...prev, showSettings: false }))}
      />
      <Settings />
    </Dialog>
  )
}
