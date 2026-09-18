import { Box, Chip, Typography, useTheme } from '@mui/material';
import { cloneElement } from 'react';
import { useTranslation } from 'react-i18next';

type PipelineSelectorItemsProps = {
  title: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  description?: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function PipelineSelectorItems({
  title,
  children,
  icon,
  description,
  isSelected,
  onClick,
} : PipelineSelectorItemsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return <>
    <Box
      sx={{
        p: 2,
        display: 'flex', flexDirection: 'column', gap: 0
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, pb: 1.5 }}>
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
        <Chip
          onClick={() => {
            onClick?.();
          }}
          color="primary"
          label={t('pipelineViewAll')}
          variant={isSelected ? 'filled' : 'outlined'}
        />
      </Box>
      {children && <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0px, 1fr))',
        gap: 1 }}>
        {children}
      </Box>}

      {!children && <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
        {t('pipelineNoItems')}
      </Typography>}
    </Box>
  </>
}
