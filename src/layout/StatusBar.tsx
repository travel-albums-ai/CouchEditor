import LoadingBar from '@/components/LoadingBar';
import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { useSelectedStoreSelector } from '@/context/selectedStore';
import { Box, Theme } from '@mui/material';

export default function StatusBar() {
  const selectedPhotos = useSelectedStoreSelector(s => s.photos)

  return (
    <Box
      id="status-bar"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1.5,
        px: 0.75,
        pl: 1.25,
        height: '28px',
        bgcolor: 'background.default',
        position: 'relative',
        borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <LoadingBar />

      <GeneralRegistryToolbar
        noGhost
        noDivider={false}
        group="status-bar"
        context={{ selectedPhotos }}
      />
    </Box>
  )
}
