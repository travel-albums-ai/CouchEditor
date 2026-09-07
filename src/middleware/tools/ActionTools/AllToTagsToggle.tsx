import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSelected, useSelectedStoreSelector } from '@/context/selectedStore';
import { useTagsStore, useTagsStoreSelector } from '@/context/tagsStore';
import { BadgeX, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AllToTagsToggle({ context } : { context: { photosIds?: string[] } }) {
  const { removeMany: removeManySelected } = useSelected()
  const { addTagToPhotos, removeTagFromPhotos, removeAllTagsFromPhotos } = useTagsStore()
  const { t } = useTranslation()
  const photosIds = context?.photosIds || []

  const selectedPhotos = useSelectedStoreSelector((state) => state.photos)
  const { tags, taggedPhotos } = useTagsStoreSelector((state) => state)

  const remainingPhotoIds = photosIds ? photosIds?.filter(id => selectedPhotos.includes(id)) : selectedPhotos

  return <GenericToggleButtonGroup items={[
    ...tags.map(tag => ({
      tooltip: t('toggleAllTaggedWith', { tag: tag.name }),
      icon: <Tag color={tag.color} fill={tag.color} />,
      onClick: () => {
        const areAllTagged = taggedPhotos.filter(tp => remainingPhotoIds.includes(tp.id) && tp.tags.includes(tag.id)).length === remainingPhotoIds.length

        if (areAllTagged) {
          removeTagFromPhotos(tag.id, remainingPhotoIds)
          removeManySelected(remainingPhotoIds)
        } else {
          addTagToPhotos(tag.id, remainingPhotoIds)
          removeManySelected(remainingPhotoIds)
        }
      },
      title: ''
    })),
    {
      tooltip: t('toggleAllTags'),
      icon: <BadgeX /> ,
      onClick: () => {
        removeAllTagsFromPhotos(remainingPhotoIds)
        removeManySelected(remainingPhotoIds)
      },
      title: ''
    },
  ] satisfies GenericToggleButtonProps[]} />
}
