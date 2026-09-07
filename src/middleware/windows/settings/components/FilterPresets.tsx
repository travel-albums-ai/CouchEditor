import PopoverButton from '@/components/PopoverButton';
import { useFilterPresetSelector, useFilterPresetStore } from '@/context/filterPresetStore';
import { useFilterPhotos, useFilterStoreSelector } from '@/context/filterStore';
import FilterPresetsItem from '@/middleware/windows/settings/components/FilterPresetsItem';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { PlusCircle, Recycle, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FilterPresets() {
  const { addFilter, reset } = useFilterPresetStore()
  const filters = useFilterPresetSelector((state) => state.filters)
  const { reset: resetAllPhotos } = useFilterPhotos()
  const allPhotosSettings =  useFilterStoreSelector((state) => state)
  const { t } = useTranslation()

  return <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'space-between' }} >
    <PopoverButton width={500}  trigger={<Button variant="outlined" size="small">{t('presetsButton')}</Button>} anchorHorizontal="center" anchorVertical="bottom" transformHorizontal="center" transformVertical="top">

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexWrap: 'wrap', p: 1 }} >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }} >
          {filters.length > 0 && filters.map((filter) => (
            <FilterPresetsItem key={filter.id} filter={filter} />
          ))}
          {filters.length === 0 && <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="textSecondary">
              {t('noPresetsYet')}
            </Typography>
          </Box>}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flex: 1, justifyContent: 'flex-end' }} >
          <Button onClick={() => addFilter(`Filter ${filters.length + 1}`, allPhotosSettings)} variant="outlined" size="small" >
            <PlusCircle size={16} />
          </Button>
          <Button onClick={() => { reset() }} variant="outlined" size="small" color="error">
            <Trash size={16} />
          </Button>

        </Box>
      </Box>

    </PopoverButton>
    <IconButton onClick={() => { resetAllPhotos() }} variant="outlined" size="small" color="inherit">
      <Recycle />
    </IconButton>
  </Box>
}
