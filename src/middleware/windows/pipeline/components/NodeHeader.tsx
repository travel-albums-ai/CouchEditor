import { useSettingsStoreSelector } from '@/context/settingsStore';
import { paletteItems } from '@/middleware/windows/pipeline/NodePalette';
import { Box, Typography, useTheme } from '@mui/material';
import { cloneElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import stc from 'string-to-color';

type NodeHeaderProps = {
  type: string;
  sx?: object;
  children?: React.ReactNode;
};

function NodeHeader({
  type,
  sx,
  children,
}: NodeHeaderProps) {
  const performanceMode = useSettingsStoreSelector(
    s => s.performanceMode
  );

  const theme = useTheme();
  const { t } = useTranslation();

  const paletteItem = useMemo(
    () => paletteItems.find(item => item.type === type),
    [type]
  );

  const typeColor = useMemo(
    () => stc(type),
    [type]
  );

  const groupColor = useMemo(
    () => stc(paletteItem?.group ?? ''),
    [paletteItem?.group]
  );

  const isDark = theme.palette.mode === 'dark';

  const iconColor = useMemo(
    () =>
      isDark
        ? `color-mix(in srgb, ${typeColor} 55%, ${groupColor} 100%)`
        : `color-mix(in srgb, ${typeColor} 100%, ${groupColor} 20%)`,
    [isDark, typeColor, groupColor]
  );

  const hoverBackground = useMemo(
    () => {
      return isDark
        ? `linear-gradient(
            270deg,
            transparent 0%,
            color-mix(in srgb, ${typeColor} 4%, ${groupColor} 12%) 150%
          )`
        : `linear-gradient(
          0deg,
            ${theme.palette.background.paper} 0%,
            ${theme.palette.background.paper} 30%,
            color-mix(in srgb, ${typeColor} 6%, transparent) 100%
          )`;
    },
    [
      performanceMode,
      isDark,
      typeColor,
      groupColor,
    ]
  );

  return (
    <Box
      sx={[
        {
          cursor: 'grab',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          p: 1,
          bgcolor: 'background.paper',

          '&:hover': {
            background: hoverBackground,
          },
        },
        sx,
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: 0,
        }}
      >
        {paletteItem?.icon &&
          cloneElement(paletteItem.icon, {
            size: 20,
            style: {
              color: iconColor,
            },
          })}

        <Typography
          variant="caption"
          color="textPrimary"
          sx={{
            fontSize: 14,
            fontWeight: 600,
            opacity: 0.87,
            '&:hover': {
              opacity: 1,
            },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {paletteItem && t(paletteItem.labelKey)}
        </Typography>
      </Box>

      {children}
    </Box>
  );
}

export default NodeHeader;
