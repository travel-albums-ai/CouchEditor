import { Box, Button, Typography, useTheme } from '@mui/material';
import { cloneElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PipelineSelectorItemsProps = {
  title: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  description?: string;
};

export default function PipelineSelectorItems({
  title,
  children,
  icon,
  description,
} : PipelineSelectorItemsProps) {
  const [collapse, setCollapse] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();

  return <>
    <Box
      sx={{
        p: 2,
        display: 'flex', flexDirection: 'column', gap: 0
      }}
    >

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, pb: 1.5 }} onClick={() => setCollapse(!collapse)}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon && cloneElement(icon as any, { color: theme.palette.primary.main })}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }} color="textPrimary">
              {t(title)}
            </Typography>
            {description && <Typography variant="caption" color="textDisabled">
              {t(description ?? '')}
            </Typography>}
          </Box>
        </Box>
        <Button variant="outlined" size="small">
          View All
        </Button>
      </Box>

      {!collapse && <>

        {children && <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0px, 1fr))',
          gap: 1 }}>
          {children}
        </Box>}

        {!children && <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
        No items available
        </Typography>}


      </>}
    </Box>
  </>
}
