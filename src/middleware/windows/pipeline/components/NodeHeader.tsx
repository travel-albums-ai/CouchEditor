import { useSettingsStoreSelector } from '@/context/settingsStore';
import PreviewTitle from '@/middleware/windows/pipeline/components/PreviewTitle';
import { paletteItems } from '@/middleware/windows/pipeline/NodePalette';
import { Box, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import stc from 'string-to-color';

type NodeHeaderProps = {
  type: string;
  sx?: object;
  children?: React.ReactNode;
};

export default function NodeHeader({
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
          gap: 2,
          // p: 1,
          bgcolor: 'background.paper',

          '&:hover': {
            background: hoverBackground,
          },
          pr: 1,
        },
      ]}
    >
      {paletteItem && <PreviewTitle paletteItem={paletteItem} />}
      {children}
    </Box>
  );
}
