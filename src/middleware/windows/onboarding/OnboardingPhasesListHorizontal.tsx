import { useSettingsStoreSelector } from '@/context/settingsStore';
import { alpha, Box, Typography, useTheme } from '@mui/material';
import { cloneElement, JSX, } from 'react';
import { useTranslation } from 'react-i18next';

export default function OnboardingPhasesListHorizontal({ phaseSteps } : { phaseSteps: { key: string, icon: JSX.Element, titleKey: string, descriptionKey: string, children?: JSX.Element }[] }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const performanceMode = useSettingsStoreSelector(s => s.performanceMode);

  return (<Box sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 2,
    px: 2
  }}>
    {phaseSteps.map((step, i) => (
      <Box key={step.key} sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, width: '100%', px: 2, py: 2,
        borderBottom: '1px solid',
        borderRadius: 2,
        boxShadow: 4,
        bgcolor: theme =>
          performanceMode
            ? alpha(theme.palette.background.paper, 0.95)
            : theme.palette.background.paper,
        borderColor: 'divider',
        transition: 'border-color 0.15s ease, box-shadow 0.35s ease, background-color 0.5s ease',
        '&:hover': {
          borderColor: theme =>
            alpha(theme.palette.primary.main, 0.26),
          boxShadow: theme =>
            `0 0 3px ${alpha(theme.palette.primary.main, 0.8)}`,
        },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {cloneElement(step.icon, { size: 16, color: theme.palette.primary.main })}
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold',
            color: theme.palette.primary.main,
            textShadow: `1px 1px 0px ${theme.palette.background.paper}`,
          }}>{t(step.titleKey)}</Typography>
        </Box>
        <Typography variant="subtitle2" color="textSecondary">{t(step.descriptionKey)}</Typography>
        {step.children && step.children}
      </Box>
    ))}
  </Box>)
}
