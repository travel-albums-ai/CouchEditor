import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useFavorites } from '@/context/favoritesStore';
import { useIgnored, useIgnored_areAllIgnored } from '@/context/ignoredStore';
import { usePrivate } from '@/context/privateStore';
import { useSelected, useSelectedStoreSelector } from '@/context/selectedStore';
import { Trash, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AllToIgnoreToggle({ context } : { context: { photosIds?: string[] } }) {
  const { addMany, removeMany } = useIgnored()

  const { removeMany: removeManySelected } = useSelected()
  const { removeMany: removeManyFavorites } = useFavorites()
  const { removeMany: removeManyPrivate } = usePrivate()
  const { t } = useTranslation()
  const photosIds = context?.photosIds || []

  const selectedPhotos = useSelectedStoreSelector((state) => state.photos)

  const remainingPhotoIds = photosIds ? photosIds?.filter(id => selectedPhotos.includes(id)) : selectedPhotos

  const areAllIgnored = useIgnored_areAllIgnored(remainingPhotoIds)

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('toggleAllIgnored'),
      icon: <Trash />,
      kbd: 'Delete',
      onClick: () => {
        addMany(remainingPhotoIds)
        removeManyFavorites(remainingPhotoIds)
        removeManyPrivate(remainingPhotoIds)
        removeManySelected(remainingPhotoIds)
      },
      meta: {
        name: t('markAsIgnored'),
        description: t('ignoreAllSelectedPhotos'),
        icon: <Trash />,
        group: 'Bulk Actions'
      },
      disabled: areAllIgnored,
      title: ''
    },
    {
      tooltip: t('toggleAllNotIgnored'),
      icon: <Upload />,
      kbd: 'Shift+Delete',
      meta: {
        name: t('unmarkAsIgnored'),
        description: t('unignoreAllSelectedPhotos'),
        icon: <Upload />,
        group: 'Bulk Actions'
      },
      onClick: () => {
        removeMany(remainingPhotoIds)
        removeManyFavorites(remainingPhotoIds)
        removeManyPrivate(remainingPhotoIds)
        removeManySelected(remainingPhotoIds)
      },
      disabled: !areAllIgnored,
    },
  ] satisfies GenericToggleButtonProps[]} />
}
