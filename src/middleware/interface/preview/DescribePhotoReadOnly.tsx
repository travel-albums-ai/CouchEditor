import { useDescriptions } from '@/context/descriptionsStore';
import { Box, Typography } from '@mui/material';
import { Astroid } from 'lucide-react';

export default function DescribePhotoReadOnly({ photoId, className, sx }: { photoId: string; className?: string, sx?: any }) {
  const { getDescription } = useDescriptions()

  return <Box className={className} sx={{...sx, display: 'flex', alignItems: 'center', gap: 1 }}>
    <Astroid size={12} style={{ width: '22px'}} />
    <Typography variant="caption" color="textSecondary">
      {getDescription(photoId)}
    </Typography>
  </Box>
}
