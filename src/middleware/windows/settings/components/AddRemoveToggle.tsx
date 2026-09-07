import { useFilterPhotos } from '@/context/filterStore';
import { Box, IconButton, Typography } from '@mui/material';
import { Minus, Plus } from 'lucide-react';

export default function AddRemoveToggle({ sectionName, group, count } : { sectionName: any, group: { name: string, photos: { id: string }[]}, count: number  }) {
  const { toggleIncludedSection, toggleExcludedSection, isIncluded, isExcluded } = useFilterPhotos();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
      <IconButton
        sx={{
          minWidth: 0,
          bgcolor: theme => isIncluded(sectionName, group.name) ? `${theme.palette.primary.main}44` : 'transparent',
        }}
        size="small"
        disabled={isExcluded(sectionName, group.name)}
        onClick={() => toggleIncludedSection(sectionName, group.name, group.photos.map(p => p.id))}
        color={isIncluded(sectionName, group.name) ? 'primary' : 'default'}
      >
        <Plus size={12} />
      </IconButton>
      <Typography variant="caption"

        sx={{
          lineHeight: 1,
          color: theme => (isIncluded(sectionName, group.name) || isExcluded(sectionName, group.name)) ? theme.palette.text.primary : theme.palette.text.disabled,
        }}
      >{`${group.name} (${count})`}</Typography>
      <IconButton
        sx={{
          minWidth: 0,
          bgcolor: theme => isExcluded(sectionName, group.name) ? `${theme.palette.error.main}44` : 'transparent'
        }}
        size="small"
        disabled={isIncluded(sectionName, group.name)}
        onClick={() => toggleExcludedSection(sectionName, group.name, group.photos.map(p => p.id))}
        color={isExcluded(sectionName, group.name) ? 'error' : 'default'}
      >
        <Minus size={12} />
      </IconButton>
    </Box>
  );
}
