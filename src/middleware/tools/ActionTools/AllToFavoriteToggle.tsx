import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useFavorites } from '@/context/favoritesStore';
import { useIgnored } from '@/context/ignoredStore';
import { useSelected, useSelectedStoreSelector } from '@/context/selectedStore';
import { Star, StarOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AllToFavoriteToggle({ context } : { context: { photosIds?: string[] } }) {
  const { areAllFavorite, addMany, removeMany } = useFavorites()
  const { removeMany: removeManySelected } = useSelected()
  const { removeMany: removeManyIgnored } = useIgnored()
  const { t } = useTranslation()
  const photosIds = context?.photosIds || []

  const selectedPhotos = useSelectedStoreSelector((state) => state.photos)
  const remainingPhotoIds = photosIds ? photosIds?.filter(id => selectedPhotos.includes(id)) : selectedPhotos

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('toggleAllFavorites'),
      icon: <Star fill="currentColor" /> ,
      onClick: () => {
        addMany(remainingPhotoIds);
        removeManySelected(remainingPhotoIds)
        removeManyIgnored(remainingPhotoIds)
      },
      title: '',
      disabled: areAllFavorite(remainingPhotoIds)
    },
    {
      tooltip: t('toggleAllNotFavorites'),
      icon: <StarOff />,
      onClick: () => {
        removeMany(remainingPhotoIds);
        removeManySelected(remainingPhotoIds);
        removeManyIgnored(remainingPhotoIds)
      },
      disabled: !areAllFavorite(remainingPhotoIds),
    },
  ] satisfies GenericToggleButtonProps[]} />
}
