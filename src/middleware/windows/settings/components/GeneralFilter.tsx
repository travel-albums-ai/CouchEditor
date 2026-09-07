import { useFilterPhotos } from '@/context/filterStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import AddRemoveToggle from '@/middleware/windows/settings/components/AddRemoveToggle';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { Trash } from 'lucide-react';
import { Fragment } from 'react';

export default function GeneralFilter({ type, listRaw }: { type: string, listRaw?: any[] }) {
  const sections = useSections_GLOBAL()
  const relevantSection = sections?.find(s => s.type === type)
  const { clearSection } = useFilterPhotos();

  return <>
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', p: 2, py: 2, gap: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="caption" color="textDisabled">Include or exclude various groups to narrow down your focus</Typography>
      <Tooltip title="Clear all filters in this section" arrow>
        <IconButton color="error" size="small" onClick={() => clearSection(type as any)}>
          <Trash size={16} />
        </IconButton>
      </Tooltip>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, p: 2, flexWrap: 'wrap' }}>

      {listRaw?.sort((a, b) => a.name.localeCompare(b.name))
        .map((group) => <Fragment key={group.name} >
          <AddRemoveToggle sectionName={type} group={group} count={relevantSection?.data.find(d => d.name === group.name)?.photos?.length || 0} />
        </Fragment>) }
    </Box>
  </>;
}
