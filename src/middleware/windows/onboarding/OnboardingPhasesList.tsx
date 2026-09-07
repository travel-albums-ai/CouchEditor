import { Box, Typography, useTheme } from '@mui/material';
import { cloneElement, JSX } from 'react';
import { useTranslation } from 'react-i18next';

export default function OnboardingPhasesList({ phaseSteps } : { phaseSteps: { key: string, icon: JSX.Element, titleKey: string, descriptionKey: string, children?: JSX.Element }[] }) {
  const { t } = useTranslation();
  const theme = useTheme()

  return (<Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
    {phaseSteps.map((step, i) => (
      <Box key={step.key} sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, width: '100%', px: 2, py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        transition: 'background-color 0.3s',
        '&:hover': {
          backgroundColor: 'action.hover',
        }
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
