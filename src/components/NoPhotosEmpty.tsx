import { Box } from '@mui/material';

const COUNT = 12;

export default function NoPhotosEmpty() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 42px)',
        gridAutoRows: '42px',
        gap: 1,
        overflow: 'hidden',

        '@keyframes emptyPhotoDrift': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-20px) scale(0.9)',
          },
          '15%': {
            opacity: 0.35,
          },
          '70%': {
            opacity: 0.25,
          },
          '100%': {
            opacity: 0,
            transform: 'translateY(45px) scale(1)',
          },
        },
      }}
    >
      {Array.from({ length: COUNT }, (_, index) => (
        <Box
          key={index}
          sx={{
            width: 42,
            height: 42,
            borderRadius: 1.5,
            backgroundColor: 'action.hover',

            animation: 'emptyPhotoDrift 3s ease-in-out infinite',
            animationDelay: `${index * 250}ms`,
          }}
        />
      ))}
    </Box>
  );
}
