import { useSettingsStoreSelector } from '@/context/settingsStore';
import { paletteItems } from '@/middleware/windows/pipeline/NodeToolbox';
import { Box, Typography } from '@mui/material';
import { cloneElement, useMemo } from 'react';
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

  const iconColor = useMemo(
    () =>
      `color-mix(in srgb, color-mix(in srgb, ${typeColor} 50%, ${groupColor} 100%) 95%, currentColor 50%)`,
    [typeColor, groupColor]
  );

  const borderBottomColor = useMemo(
    () =>
      `color-mix(in srgb, color-mix(in srgb, ${typeColor} 50%, ${groupColor} 70%) 35%, currentColor 25%)`,
    [typeColor, groupColor]
  );

  const background = useMemo(
    () =>
      performanceMode
        ? `color-mix(in srgb, color-mix(in srgb, ${typeColor} 2%, ${groupColor} 8%) 100%, var(--mui-palette-background-paper) 45%)`
        : `linear-gradient(90deg, transparent 0%, color-mix(in srgb, ${typeColor} 2%, ${groupColor} 8%) 125%)`,
    [performanceMode, typeColor, groupColor]
  );

  const hoverBackground = useMemo(
    () =>
      performanceMode
        ? `color-mix(in srgb, color-mix(in srgb, ${typeColor} 4%, ${groupColor} 12%) 100%, var(--mui-palette-background-paper) 30%)`
        : `linear-gradient(90deg, transparent 0%, color-mix(in srgb, ${typeColor} 4%, ${groupColor} 12%) 150%)`,
    [performanceMode, typeColor, groupColor]
  );

  const hoverShadow = useMemo(
    () =>
      `0 1px 2px 0px color-mix(in srgb, ${typeColor} 15%, ${groupColor} 25%)`,
    [typeColor, groupColor]
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
            'background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',

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
        {paletteItem?.icon && (
          cloneElement(paletteItem.icon, {
            size: 16,
            style: {
              color: iconColor,
            },
          })
        )}

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {paletteItem?.label}
        </Typography>
      </Box>

      {children}
    </Box>
  );
}

export default NodeHeader;
