import { useBYOKStoreSelector } from '@/context/byokStore';
import { Box } from '@mui/material';

export default function AiLoadingBar() {
  const { aiLoading } = useBYOKStoreSelector((state) => state);

  if (!aiLoading) {
    return null;
  }

  return (
    <Box
      id="ai-loading"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',

        // The glowing inner border
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          border: '2px solid transparent',
          borderRadius: '2px',

          background: `
            linear-gradient(135deg,
              rgba(120, 145, 255, 0.85),
              rgba(170, 120, 255, 0.75),
              rgba(90, 190, 210, 0.8),
              rgba(170, 120, 255, 0.75),
              rgba(120, 145, 255, 0.85)
            ) border-box
          `,

          mask: `
            linear-gradient(#000 0 0) padding-box,
            linear-gradient(#000 0 0)
          `,
          maskComposite: 'exclude',

          boxShadow: `
            inset 0 0 18px rgba(130, 150, 255, 0.35),
            inset 0 0 45px rgba(130, 150, 255, 0.12)
          `,

          backgroundSize: '300% 300%',
          animation: 'ai-border-flow 5s ease-in-out infinite',
        },

        // Soft light bleeding inward from the border
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: '2px',

          boxShadow: `
            inset 0 0 35px rgba(120, 150, 255, 0.20),
            inset 0 0 90px rgba(150, 120, 255, 0.08)
          `,

          animation: 'ai-breathe 3s ease-in-out infinite',
        },

        '@keyframes ai-border-flow': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },

        '@keyframes ai-breathe': {
          '0%, 100%': {
            opacity: 0.55,
          },
          '50%': {
            opacity: 1,
          },
        },
      }}
    />
  );
}
