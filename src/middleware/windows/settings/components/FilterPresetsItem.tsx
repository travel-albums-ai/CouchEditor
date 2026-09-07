import { useFilterPresetStore } from '@/context/filterPresetStore';
import { useFilterPhotos } from '@/context/filterStore';
import { Box, IconButton, TextField } from '@mui/material';
import { Play, Trash } from 'lucide-react';
import { useState } from 'react';

export default function FilterPresetsItem({ filter }: { filter: { id: string, name: string, data: any } }) {
  const { deleteFilter, updateName } = useFilterPresetStore()
  const { loadFromPreset } = useFilterPhotos()
  const [name, setName] = useState(filter.name)

  return <>
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', border: '1px solid', borderColor: 'divider', px: 1, py: 0.5, borderRadius: 2 }} >
      <IconButton onClick={() => loadFromPreset(filter.data)} color="primary" size="small" >
        <Play size={16} />
      </IconButton>
      <TextField value={name} size="small" onChange={(e) => setName(e.target.value)} onBlur={() => updateName(filter.id, name)} size="small" fullWidth />
      <IconButton onClick={() => deleteFilter(filter.id)} color="error" size="small" >
        <Trash size={16} />
      </IconButton>
    </Box>
  </>
}
