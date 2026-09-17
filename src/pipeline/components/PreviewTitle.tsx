import { NodePaletteItem } from '@/pipeline/NodePalette';
import { Box, Typography } from '@mui/material';
import { cloneElement } from 'react';
import { useTranslation } from 'react-i18next';
import stc from 'string-to-color';

export default function PreviewTitle({ paletteItem } : { paletteItem: NodePaletteItem }) {
  const { t } = useTranslation();

  return <>
    <Box sx={{ mx: 1, py: 1, display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
      <Box sx={{
        bgcolor: `color-mix(in srgb, color-mix(in srgb, ${stc(paletteItem.type)} 100%, ${stc(paletteItem.groupKey)} 20%) 8%, transparent 0%)`,
        p: 1.25,
        borderRadius: 2,
        lineHeight: 0
      }}>
        {cloneElement(paletteItem.icon as React.ReactElement<any>, { size: 20,
          color: `color-mix(in srgb, ${stc(paletteItem.type)} 100%, ${stc(paletteItem.groupKey)} 20%)`,
          style: {
            lineHeight: 0,
          }
        })}
      </Box>
      <Typography color="textPrimary" sx={{ lineHeight: 0, fontSize: 20, fontWeight: 'bold', opacity: 0.9 }}>{t(paletteItem.labelKey)}</Typography>
    </Box>
  </>
}
