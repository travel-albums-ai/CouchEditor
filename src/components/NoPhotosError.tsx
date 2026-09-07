import { Box, Skeleton } from '@mui/material';

const BOX_SIZE = 42;
const COUNT = 12;

const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export default function NoPhotosError() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1,
      }}
    >
      {Array.from({ length: COUNT }, (_, i) => {
        const duration = random(1.8, 3.2);
        const delay = random(-3.2, 0);

        return (
          <Skeleton
            key={i}
            variant="rounded"
            width={BOX_SIZE}
            height={BOX_SIZE}
            sx={{
              opacity: 0.6,
              animation: `photoPulse ${duration}s ease-in-out infinite`,
              animationDelay: `${delay}s`,

              '@keyframes photoPulse': {
                '0%, 100%': {
                  opacity: 0.4,
                  transform: 'scale(0.85)',
                  backgroundColor: 'background.paper',
                },

                '50%': {
                  opacity: 0.5,
                  transform: 'scale(1.05)',
                  backgroundColor: 'error.main',
                },
              },
            }}
          />
        );
      })}
    </Box>
  );
}
