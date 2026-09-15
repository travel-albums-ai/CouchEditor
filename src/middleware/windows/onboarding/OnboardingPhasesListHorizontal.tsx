import { useSettingsStoreSelector } from '@/context/settingsStore';
import { alpha, Box, Typography, useTheme } from '@mui/material';
import { cloneElement, JSX, } from 'react';
import { useTranslation } from 'react-i18next';
import stc from 'string-to-color';

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
        bgcolor: theme => theme.palette.background.paper,
        boxShadow: theme => `0 0 16px -3px ${theme.palette.divider}`,
        // bgcolor: theme =>
        //   performanceMode
        //     ? alpha(theme.palette.background.paper, 0.95)
        //     : theme.palette.background.paper,
        borderColor: 'divider',
        transition: 'border-color 0.15s ease, box-shadow 0.35s ease, background-color 0.5s ease',
        // '&:hover': {
        //   borderColor: theme =>
        //     alpha(theme.palette.primary.main, 0.26),
        //   boxShadow: theme =>
        //     `0 0 3px ${alpha(theme.palette.primary.main, 0.8)}`,
        // },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
            borderRadius: 2,
            bgcolor: alpha(stc(step.titleKey), 0.1),
          }}>
            {cloneElement(step.icon, { size: 28,
              color: stc(step.titleKey)
            })}
          </Box>
          <Box>
            <Typography variant="subtitle2" color="textPrimary" sx={{ fontWeight: 'bold',
              // color: theme.palette.primary.main,
              textShadow: `1px 1px 0px ${theme.palette.background.paper}`,
            }}>{t(step.titleKey)}</Typography>
            <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 1 }}>{t(step.descriptionKey)}</Typography>
          </Box>
        </Box>

        {step.children && step.children}
      </Box>
    ))}
  </Box>)
}
