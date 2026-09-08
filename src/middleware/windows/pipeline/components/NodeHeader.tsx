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
        : `color-mix(in srgb, ${typeColor} 65%, ${groupColor} 85%)`,
    [isDark, typeColor, groupColor]
  );

  const borderBottomColor = useMemo(
    () =>
      isDark
        ? `color-mix(in srgb, ${typeColor} 35%, ${groupColor} 55%)`
        : `color-mix(in srgb, ${typeColor} 45%, ${groupColor} 65%)`,
    [isDark, typeColor, groupColor]
  );

  const background = useMemo(
    () => {
      if (performanceMode) {
        return isDark
          ? `color-mix(in srgb, color-mix(in srgb, ${typeColor} 2%, ${groupColor} 8%) 100%, var(--bg-paper) 45%)`
          : `color-mix(in srgb, color-mix(in srgb, ${typeColor} 5%, ${groupColor} 8%) 100%, var(--bg-paper) 25%)`;
      }

      return isDark
        ? `linear-gradient(
            90deg,
            transparent 0%,
            color-mix(in srgb, ${typeColor} 2%, ${groupColor} 8%) 125%
          )`
        : `linear-gradient(
            90deg,
            color-mix(in srgb, ${typeColor} 3%, transparent) 0%,
            color-mix(in srgb, ${groupColor} 10%, transparent) 100%
          )`;
    },
    [
      performanceMode,
      isDark,
      typeColor,
      groupColor,
    ]
  );

  const hoverBackground = useMemo(
    () => {
      if (performanceMode) {
        return isDark
          ? `color-mix(in srgb, color-mix(in srgb, ${typeColor} 4%, ${groupColor} 12%) 100%, var(--bg-paper) 30%)`
          : `color-mix(in srgb, color-mix(in srgb, ${typeColor} 8%, ${groupColor} 12%) 100%, var(--bg-paper) 15%)`;
      }

      return isDark
        ? `linear-gradient(
            90deg,
            transparent 0%,
            color-mix(in srgb, ${typeColor} 4%, ${groupColor} 12%) 150%
          )`
        : `linear-gradient(
            90deg,
            color-mix(in srgb, ${typeColor} 5%, transparent) 0%,
            color-mix(in srgb, ${groupColor} 16%, transparent) 100%
          )`;
    },
    [
      performanceMode,
      isDark,
      typeColor,
      groupColor,
    ]
  );

  const hoverShadow = useMemo(
    () =>
      isDark
        ? `0 1px 2px 0px color-mix(in srgb, ${typeColor} 15%, ${groupColor} 25%)`
        : `0 1px 3px 0px color-mix(in srgb, ${typeColor} 12%, ${groupColor} 18%)`,
    [isDark, typeColor, groupColor]
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
          py: 0.75,
          px: 1,
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          borderBottomColor,
          background,
          transition:
            'border-color 0.15s ease, box-shadow 0.35s ease, background 0.5s ease',

          '&:hover': {
            background: hoverBackground,
            boxShadow: hoverShadow,
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
            size: 16,
            style: {
              color: iconColor,
            },
          })}

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
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
