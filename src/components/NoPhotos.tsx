import { Box } from '@mui/material';

export default function NoPhotos({ isEmpty = true, isLoading = false, isError = false }: { isEmpty?: boolean, isLoading?: boolean, isError?: boolean }) {
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
        src="./couchLogoMini.png"
        alt="Logo"
        width={90}
        height={60}
        fetchPriority="high"
        style={{
          opacity: 0.3,
          filter: 'grayscale(100%)',
        }}
      />
    </Box>
  );
}
