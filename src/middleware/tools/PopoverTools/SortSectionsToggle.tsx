import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSidebar, useSidebarStoreSelector } from '@/context/sidebarStore';
import SettingSelectRow from '@/middleware/windows/settings/components/SettingSelectRow';
import { Box } from '@mui/material';
import { ArrowDown01Icon, ArrowUp01Icon, EllipsisVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SortSectionsToggle() {
  const { setSetting } = useSidebar()
  const { sortBy, sortAsc } = useSidebarStoreSelector((state) => state)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup id="sort-sections-toggle"
    items={[
      {
        value: true,
        tooltip: t('ascending'),
        icon: <ArrowDown01Icon size={20} />,
        onClick: () => setSetting((prev) => ({ ...prev, sortAsc: true })),
        selected: sortAsc === true,
        disabled: sortBy === 'original',
      },
      {
        value: false,
        tooltip: t('descending'),
        icon: <ArrowUp01Icon size={20} />,
        onClick: () => setSetting((prev) => ({ ...prev, sortAsc: false })),
        selected: sortAsc === false,
        disabled: sortBy === 'original',
      },
      {
        tooltip: t('openSectionsSettings'),
        icon: <EllipsisVertical />,
        popover: <Box sx={{ width: '300px', maxHeight: '75vh', overflowY: 'auto' }}>
          <SettingSelectRow
            label=""
            value={sortBy}
            options={['count', 'name', 'original']}
            onChange={(value) => setSetting((prev) => ({ ...prev, sortBy: value as any }))}
          />
        </Box>,
      },
    ] as GenericToggleButtonProps[] satisfies GenericToggleButtonProps[]}
  />
}
