import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { Box } from '@mui/material';

export default function Header() {
  return (
    <Box
      id="header-bar"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 1,
        pt: 0.65,
        pb: 0.75,
        height: '50px',
        bgcolor: 'background.default',
        position: 'relative',
        borderBottom: `1px solid`,
        borderColor: 'divider'
      }}
    >
      <GeneralRegistryToolbar
        noGhost={true}
        group="header"
      />
    </Box>
  );
}
