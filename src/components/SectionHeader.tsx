import { Box, Typography, useTheme } from '@mui/material';

import { createElement } from 'react';

type PipelineSelectorProps = {
  sx?: object;
  image: string;
  bgSize?: 'contain' | 'cover' | 'auto' | string;
  icon: React.ElementType;
  iconSize: number;
  title: string;
  subTitle: string;
};

export default function SectionHeader({
  sx,
  image,
  bgSize = 'contain',
  icon,
  iconSize,
  title,
  subTitle,
}: PipelineSelectorProps) {
  const theme = useTheme()


  return (
    <>
      <Box sx={{ position: 'relative',
        backgroundImage: `url(${image})`,
        backgroundSize: bgSize,
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
      }}>
        <Box sx={{ py: 5, pl: 4, display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'flex-start', ...sx }}>
          {icon && createElement(icon, { size: iconSize, color: theme.palette.primary.main })}
          <Box sx={{ borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography color="textPrimary" variant="h6">{title}</Typography>
            <Typography color="textSecondary" variant="caption" sx={{ whiteSpace: 'wrap', maxWidth: '400px', display: 'block' }}>{subTitle}</Typography>
          </Box>
        </Box>
      </Box>

    </>
  );
}
