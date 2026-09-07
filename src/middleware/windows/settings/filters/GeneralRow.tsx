import SolidChip from '@/components/SolidChip';
import { useFilterPhotos } from '@/context/filterStore';
import { Box, Typography } from '@mui/material';

export default function GeneralRow({ type = "countries", label = "Countries filter" }) {
  const { getIncludedForSection, getExcludedForSection } = useFilterPhotos();

  return <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
    <Typography variant="subtitle2">
      {label}...
    </Typography>
    {getIncludedForSection(type).length > 0 && <SolidChip label={`Included (${getIncludedForSection(type).length})`} color="success" size="extraSmall" sx={{ ml: 1 }} />}
    {getExcludedForSection(type).length > 0 && <SolidChip label={`Excluded (${getExcludedForSection(type).length})`} color="error" size="extraSmall" sx={{ ml: 0.5 }} />}

  </Box>;
}
