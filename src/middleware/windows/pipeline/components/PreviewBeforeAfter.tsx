import SolidChip from '@/components/SolidChip';
import { Box, Divider, useTheme } from '@mui/material';
import { Cpu } from 'lucide-react';

const previewImageUrl = 'sample.jpg';

type AdjustmentPreviewProps = {
  before?: React.ReactNode;
  after: React.ReactNode;
  value?: number;
  width?: number;
};

export function PreviewBeforeAfter({ before, after, value, width = 90 }: AdjustmentPreviewProps) {
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.5,
      justifyContent: 'center',
      transition: 'opacity 0.25s ease',
      '&:hover': {
        opacity: 1,
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {before || <img src={previewImageUrl} style={{ width: `${width}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />}

        {after && <>
          <Divider orientation="horizontal" sx={{ width: 16 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 1, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 0.5, boxShadow: 1  }}>
            <Cpu size={16} style={{ color: theme.palette.text.secondary, opacity: 0.75 }} />
            {value !== undefined && <SolidChip label={`${Math.round(value * 100) / 100}`} minWidth={45} borderless variant="header" />}
          </Box>

          <Divider orientation="horizontal" sx={{ width: 16 }} />
        </>}

        {after}
      </Box>
    </Box>
  );
}
