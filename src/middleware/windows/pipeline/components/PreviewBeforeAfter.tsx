import SolidChip from '@/components/SolidChip';
import { Box, Divider, useTheme } from '@mui/material';
import { Cpu } from 'lucide-react';

const previewImageUrl = 'sample.jpg';

type AdjustmentPreviewProps = {
  after: React.ReactNode;
  value?: number;
};

export function PreviewBeforeAfter({ after, value }: AdjustmentPreviewProps) {
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.5,
      p: 2,
      justifyContent: 'center',
      transition: 'opacity 0.25s ease',
      '&:hover': {
        opacity: 1,
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <img src={previewImageUrl} style={{ maxWidth: '90px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}` }} />

        <Divider orientation="horizontal" sx={{ width: 16 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 0.5, boxShadow: 1  }}>
          <Cpu size={16} style={{ color: theme.palette.text.secondary, opacity: 0.75 }} />
          {value !== undefined && <SolidChip label={`${Math.round(value * 100) / 100}`} minWidth={45} borderless variant="header" />}
        </Box>

        <Divider orientation="horizontal" sx={{ width: 16 }} />

        {after}
      </Box>
    </Box>
  );
}
