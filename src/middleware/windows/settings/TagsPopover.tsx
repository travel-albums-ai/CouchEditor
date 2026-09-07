import SettingsSection from '@/components/SettingsSection';
import { useTagsStore, useTagsStoreSelector } from '@/context/tagsStore';
import { Box, Button, TextField } from '@mui/material';
import { Plus, Tag } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TagsPopover() {
  const { createTag, deleteTag, updateTagName } = useTagsStore()
  const tags = useTagsStoreSelector((state) => state.tags)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#000000')
  const { t } = useTranslation()

  return <>
    <SettingsSection title={"Current tags"} icon={<Tag />}>
      {tags.map((tag) => (
        <Box key={tag.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, backgroundColor: tag.color, borderRadius: '50%' }} />
          <TextField value={tag.name} size="small" onChange={(e) => updateTagName(tag.id, e.target.value)} />
          <Button variant="outlined" color="error" onClick={() => deleteTag(tag.id)}>{t('deleteTag')}</Button>
        </Box>
      ))}
    </SettingsSection>

    <SettingsSection title="Create new tag" icon={<Plus />}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <TextField label={t('tagNameLabel')} size="small" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
        <TextField label={t('tagColorLabel')} type="color" size="small" sx={{ width: 64 }} value={newTagColor} onChange={(e) => setNewTagColor(e.target.value)} />

        <Button
          variant="contained"
          sx={{ backgroundColor: newTagColor, color: '#fff', '&:hover': { backgroundColor: newTagColor } }}
          onClick={() => {
            createTag(newTagName, newTagColor)
            setNewTagName('')
            setNewTagColor('#000000')
          }}
          disabled={!newTagName}
        >
          {t('createTag')}
        </Button>
      </Box>
    </SettingsSection>
  </>
}
