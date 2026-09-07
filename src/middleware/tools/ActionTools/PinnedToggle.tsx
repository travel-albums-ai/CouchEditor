import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { usePinned, usePinned_isPinned } from '@/context/pinnedStore';
import { Pin, PinOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export default function PinnedToggle() {
  const { type_name = '', id = '' } = useParams()
  const { add, remove } = usePinned()
  const isPinned = usePinned_isPinned({ type_name, id })
  const { t } = useTranslation()

  const handleOnChange = () => isPinned ? remove({ type_name, id }) : add({ type_name, id })

  return <>
    <WebMCPDataRun
      name="toggle_pinned_sub_section"
      description="Toggle the pinned state of the sub-section."
      execute={async () => {
        handleOnChange();
        return `Photo ${!isPinned ? 'pinned' : 'unpinned'}.`;
      }}
    />

    <GenericToggleButtonGroup items={[
      {
        tooltip: t('togglePin'),
        icon: isPinned ? <Pin /> : <PinOff />,
        onClick: () => handleOnChange(),
        selected: isPinned,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>;
}
