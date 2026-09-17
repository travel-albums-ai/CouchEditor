import { useSettingsStoreSelector } from '@/context/settingsStore';
import { paletteItems } from '@/windows/pipeline/NodePalette';
import { Box, Typography, useTheme } from '@mui/material';
import { cloneElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import stc from 'string-to-color';

type NodeHeaderProps = {
  type: string;
  sx?: object;
  children?: React.ReactNode;
};

function NodeHeaderGrid({
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
    () => stc(paletteItem?.groupKey ?? ''),
    [paletteItem?.groupKey]
  );

  const isDark = theme.palette.mode === 'dark';

  const iconColor = useMemo(
    () =>
      isDark
        ? `color-mix(in srgb, ${typeColor} 55%, ${groupColor} 100%)`
        : `color-mix(in srgb, ${typeColor} 100%, ${groupColor} 20%)`,
    [isDark, typeColor, groupColor]
  );

  return (
    <Box
      sx={[
        {
          cursor: 'grab',
          display: 'flex',
          alignSelf: 'stretch',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          justifyContent: 'center',
          gap: 0.25,
          p: 0.65,
          bgcolor: `color-mix(in srgb, color-mix(in srgb, ${stc(paletteItem?.type)} 100%, ${stc(paletteItem?.groupKey)} 20%) 8%, transparent 0%)`,
          '&:hover': {
            bgcolor: `color-mix(in srgb, color-mix(in srgb, ${stc(paletteItem?.type)} 100%, ${stc(paletteItem?.groupKey)} 20%) 12%, transparent 0%)`,
          },
        },
        sx,
      ]}
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
          textAlign: 'center',
          flex: 1,
          fontSize: 11,
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

      {children}
    </Box>
  );
}

export default NodeHeaderGrid;
