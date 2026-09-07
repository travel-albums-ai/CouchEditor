import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useFavorites } from '@/context/favoritesStore';
import { useIgnored } from '@/context/ignoredStore';
import { usePrivate } from '@/context/privateStore';
import { useSelected, useSelectedStoreSelector } from '@/context/selectedStore';
import { Eye, EyeClosed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AllToPrivateToggle({ context } : { context: { photosIds?: string[] } }) {
  const { areAllPrivate, addMany, removeMany } = usePrivate()
  const { removeMany: removeManySelected } = useSelected()
  const { removeMany: removeManyFavorites } = useFavorites()
  const { removeMany: removeManyIgnored } = useIgnored()
  const { t } = useTranslation()
  const photosIds = context?.photosIds || []

  const selectedPhotos = useSelectedStoreSelector((state) => state.photos)

  const remainingPhotoIds = photosIds ? photosIds?.filter(id => selectedPhotos.includes(id)) : selectedPhotos

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('toggleAllPrivate'),
      icon: <EyeClosed /> ,
      onClick: () => {
        addMany(remainingPhotoIds)
        removeManyFavorites(remainingPhotoIds)
        removeManySelected(remainingPhotoIds)
        removeManyIgnored(remainingPhotoIds)
      },
      disabled: areAllPrivate(remainingPhotoIds),
      title: ''
    },
    {
      tooltip: t('toggleAllNotPrivate'),
      icon: <Eye />,
      onClick: () => {
        removeMany(remainingPhotoIds)
        removeManyFavorites(remainingPhotoIds)
        removeManySelected(remainingPhotoIds)
        removeManyIgnored(remainingPhotoIds)
      },
      disabled: !areAllPrivate(remainingPhotoIds),
    },
  ] satisfies GenericToggleButtonProps[]} />
}
