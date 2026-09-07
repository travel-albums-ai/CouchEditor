import { useSettingsStoreSelector } from '@/context/settingsStore';
import { Tooltip, Typography } from '@mui/material';

export default function PreviewPhotoTitle() {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)

  return (
    <Tooltip title={previewPhotoObj?.title || ''} arrow placement="top">
      <Typography variant="caption" color="textSecondary">{`${previewPhotoObj?.title}`}</Typography>
    </Tooltip>
  );
}
