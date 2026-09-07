import { Box, Typography } from '@mui/material';
import { cloneElement } from 'react';

export default function AlbumPhotoRowItem({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <Box sx={{
      transition: 'all 0.25s',
      px: 1, py: 0.25,
      borderRadius: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      '&:hover': {
        backgroundColor: 'action.hover',
      },
    }}>
      {icon && cloneElement(icon as React.ReactElement, { size: 14, style: { marginRight: 4, verticalAlign: 'middle' } })}
      <Typography variant="caption" color="textPrimary" sx={{ fontWeight: 'bold', width: 80, display: 'inline-block', textTransform: 'capitalize' }}>
        {title}
      </Typography>
      <Typography  variant="caption" color="textDisabled">
        {String(value)}
      </Typography>
    </Box>

  );
}
