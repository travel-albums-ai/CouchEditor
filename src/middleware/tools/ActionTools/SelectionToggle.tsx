import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSelected, useSelectedStoreSelector } from '@/context/selectedStore';
import { Square, SquareCheckBig, SquareMinus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SelectionToggle({ context }: { context?: any }) {
  const { addMany, removeMany, invertMany } = useSelected()
  const selectedPhotos = useSelectedStoreSelector((state) => state.photos)
  const { t } = useTranslation()
  const photoIds = context?.photosIds || []

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('addAll'),
      kbd: 'Control+A',
      icon:  <SquareCheckBig />,
      onClick: () => photoIds && addMany(photoIds.filter((_, i) => i < 1000)),
      selected: false,
      meta: {
        name: t('addAll'),
        description: t('addAllDescription'),
        icon: <SquareCheckBig />,
        group: 'Select Mode'
      },
      disabled: photoIds?.every(id => selectedPhotos.includes(id))
    },
    {
      tooltip: t('deselectAll'),
      kbd: 'Control+D',
      meta: {
        name: t('deselectAll'),
        description: t('deselectAllDescription'),
        icon: <Square />,
        group: 'Select Mode'
      },
      icon:  <Square />,
      onClick: () => photoIds && removeMany(photoIds),
      selected: false,
      disabled: selectedPhotos?.length === 0
    },
    {
      tooltip: t('invertSelection'),
      kbd: 'Control+I',
      meta: {
        name: t('invertSelection'),
        description: t('invertSelectionDescription'),
        icon: <SquareMinus />,
        group: 'Select Mode'
      },
      icon:  <SquareMinus />,
      onClick: () => photoIds && invertMany(photoIds),
      selected: false,
      disabled: selectedPhotos?.length === 0
    },
  ] satisfies GenericToggleButtonProps[]} />
}
