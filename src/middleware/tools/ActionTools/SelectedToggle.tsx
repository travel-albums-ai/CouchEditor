import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useSelected, useSelected_isSelected } from '@/context/selectedStore';
import { Square, SquareCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SelectedToggle({ context } : { context: { photoId: string }}) {
  const { add, remove } = useSelected()
  const photoId = context.photoId
  const isSelected = useSelected_isSelected(photoId)
  const { t } = useTranslation()

  const handleOnChange = () => isSelected ? remove(photoId) : add(photoId)

  return <>
    <WebMCPDataRun
      name="toggle_selected"
      description="Toggle the selected state of the photo."
      execute={async () => {
        handleOnChange();
        return `Photo ${!isSelected ? 'selected' : 'deselected'}.`;
      }}
    />

    <GenericToggleButtonGroup variant="standard" items={[
      {
        tooltip: t('toggleSelected'),
        icon:  isSelected ? <SquareCheck /> : <Square />,
        onClick: () => handleOnChange(),
        selected: isSelected,
      },
    ] as GenericToggleButtonProps[]} />
  </>
}
