import { Box } from '@mui/material';

export default function NoPhotos() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        gap: 4,
        padding: '2rem',
        height: '100%',
      }}
    >
      <img
        src="./couch-editor-purple-128x128.png"
        alt="Logo"
        width={128}
        height={128}
        fetchPriority="high"
        style={{
          opacity: 0.3,
          filter: 'grayscale(100%)',
        }}
      />
    </Box>
  );
}
