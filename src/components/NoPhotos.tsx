import NoPhotosEmpty from '@/components/NoPhotosEmpty';
import NoPhotosError from '@/components/NoPhotosError';
import NoPhotosLoading from '@/components/NoPhotosLoading';
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
        src="./logo_new_240.webp"
        alt="Logo"
        width={120}
        height={93}
        fetchPriority="high"
        style={{
          aspectRatio: '40/31',
          opacity: 0.3,
          filter: 'grayscale(100%)',
        }}
      />

      {isLoading && <NoPhotosLoading />}

      {!isLoading && isEmpty && <NoPhotosEmpty />}

      {isError && <NoPhotosError />}

    </Box>
  );
}
