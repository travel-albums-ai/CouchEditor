import GenericPanel from '@/components/generics/GenericPanel';
import { useBYOKStoreSelector } from '@/context/byokStore';
import { useDescriptionsStoreSelector } from '@/context/descriptionsStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import SemanticPhotoSearch from '@/middleware/interface/autoDescription/SemanticPhotoSearch';
import DashboardCities from '@/middleware/interface/dashboard/DashboardCities';
import DashboardComments from '@/middleware/interface/dashboard/DashboardComments';
import DashboardCountries from '@/middleware/interface/dashboard/DashboardCountries';
import DashboardCountriesMap from '@/middleware/interface/dashboard/DashboardCountriesMap';
import DashboardFriends from '@/middleware/interface/dashboard/DashboardFriends';
import DashboardLikes from '@/middleware/interface/dashboard/DashboardLikes';
import DashboardMetrics from '@/middleware/interface/dashboard/DashboardMetrics';
import DashboardMostRecent from '@/middleware/interface/dashboard/DashboardMostRecent';
import DashboardSuggestions from '@/middleware/interface/dashboard/DashboardSuggestions';
import DashboardViews from '@/middleware/interface/dashboard/DashboardViews';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const foo = true

export default function DashboardDrawer() {
  const { type_name = '', id = '' } = useParams()
  const sections = useSections_GLOBAL()
  const filteredPhotos = useFilteredPhotos_GLOBAL();
  const byokOpenAIKey = useBYOKStoreSelector((state) => state.byokOpenAIKey)
  const descriptionsStore = useDescriptionsStoreSelector(state => state.descriptions)

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = type_name === '' ? filteredPhotos : foundSet?.photos || []
  return (
    <GenericPanel id="dashboard-drawer">
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 2}}>
        {foo && <Box sx={{ borderBottom: '1px dotted', my: 16, borderColor: 'divider', p: 2, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="textPrimary" sx={{ textAlign: 'center', py: 8 }} variant="h5">Welcome to Travel-Albums</Typography>
          <DashboardSuggestions />
        </Box>}

        <SemanticPhotoSearch
          apiKey={byokOpenAIKey || ''}
          descriptions={descriptionsStore}
          photos={photos}
        />

        <Box sx={{
          display: 'grid',
          width: '1400px',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: 2,
        }}
        >

          <DashboardMetrics />
          <DashboardMostRecent />
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          width: '1400px',
          justifyContent: 'stretch',
          gap: 2
        }}
        >
          <DashboardComments />
          <DashboardViews />
          <DashboardLikes />
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '1400px',
          justifyContent: 'stretch',
          gap: 2
        }}
        >
          <DashboardFriends />
          <DashboardCountriesMap />
          <DashboardCountries />
          <DashboardCities />
        </Box>
      </Box>
    </GenericPanel>
  );
}

{/* <div>Recent files</div>  */}
