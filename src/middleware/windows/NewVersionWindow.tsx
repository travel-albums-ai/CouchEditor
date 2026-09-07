import { useSettingsStoreSelector } from '@/context/settingsStore';
import NewVersion from '@/middleware/windows/newVersion/NewVersionWindow';
import { Dialog } from '@mui/material';

export default function NewVersionWindow() {
  const newVersion = useSettingsStoreSelector(s => s.newVersion)

  const showWindow = newVersion === true

  if (!showWindow) return null

  return (
    <Dialog
      fullWidth
      onClose={() => {}}
      open={showWindow}
    >
      <NewVersion />
    </Dialog>
  )
}
