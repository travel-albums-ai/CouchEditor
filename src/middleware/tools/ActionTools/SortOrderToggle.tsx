import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useFilterPhotos, useFilterStoreSelector } from '@/context/filterStore';
import { ArrowDown01Icon, ArrowUp01Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SortOrderToggle() {
  const { setSetting } = useFilterPhotos()
  const sortOrder = useFilterStoreSelector((state) => state.sortOrder)
  const { t } = useTranslation()

  const handleSortOrderChange = (newSortOrder: 'oldestFirst' | 'newestFirst') => {
    setSetting((prev) => ({ ...prev, sortOrder: newSortOrder }));
  }

  return <>
    <WebMCPDataRun
      name="toggle_sort_order"
      description="Toggle the sort order of photos."
      inputSchema={{
        type: 'object',
        properties: {
          sortOrder: {
            type: 'string',
            enum: ['oldestFirst', 'newestFirst'],
            description: 'The sort order of photos.',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ sortOrder }: { sortOrder: 'oldestFirst' | 'newestFirst' }) => {
        handleSortOrderChange(sortOrder);
        return 'sortOrder: ' + (sortOrder ?? 'oldestFirst') + '.';
      }}
    />

    <GenericToggleButtonGroup items={[
      {
        value: 'oldestFirst',
        webMcp: true,
        tooltip: t('sortOldestFirst'),
        onClick: () => handleSortOrderChange('oldestFirst'),
        icon: <ArrowUp01Icon size={20} />,
        selected: sortOrder === 'oldestFirst'
      },
      {
        value: 'newestFirst',
        webMcp: true,
        tooltip: t('sortNewestFirst'),
        onClick: () => handleSortOrderChange('newestFirst'),
        icon: <ArrowDown01Icon size={20} />,
        selected: sortOrder === 'newestFirst'
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
