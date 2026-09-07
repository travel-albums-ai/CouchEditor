import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useFavorites } from '@/context/favoritesStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { Star, StarOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FavoriteToggle({ context } : { context: { photoId: string }}) {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)
  const photoId = context.photoId || previewPhotoObj?.id || ''
  const { isFavorite, add, remove } = useFavorites()
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('toggleFavorite'),
      icon: isFavorite(photoId) ? <Star fill="currentColor" /> : <StarOff />,
      onClick: () => isFavorite(photoId) ? remove(photoId) : add(photoId),
      selected: isFavorite(photoId),
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}
