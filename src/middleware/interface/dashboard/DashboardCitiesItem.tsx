import SettingsSection from '@/components/SettingsSection';
import SolidChip from '@/components/SolidChip';
import DashboardPreviewImages from '@/middleware/interface/dashboard/DashboardPreviewImages';
import { Box, Stack, Typography } from '@mui/material';
import { useInView } from 'react-intersection-observer';

export default function DashboardCitiesItem({ avatar, cities } : { avatar: string, cities: { name: string, photos: any[] }[] }) {
  const limit = 100

  let citiesWithPreview = cities?.sort((a, b) => b.photos.length - a.photos.length)
    .filter((item) => item.photos.length > limit)
    .filter((item, i) => i < 4)

  let citiesWithoutPreview = cities?.filter(city => !citiesWithPreview.includes(city))
    .sort((a, b) => b.photos.length - a.photos.length)
    .filter((item) => item.photos.length <= limit)

  if(citiesWithPreview.length === 0) {
    citiesWithPreview = citiesWithoutPreview.filter((item, i) => i < 2)
    citiesWithoutPreview = citiesWithoutPreview.filter((item, i) => i >= 2)
  }

  const { inView, ref } = useInView();

  return (
    <SettingsSection gap={1} divider={false}>
      <Box
        id={`dashboard-cities-item-${avatar}`}
        ref={ref}
        key={avatar}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
        }}
      >
        <div
          className={`fflag fflag-${avatar}`}
          style={{
            width: 16,
            height: 16,
            borderRadius: 10,
            flexShrink: 0,
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'stretch', gap: 1, width: '100%' }}>
          {citiesWithPreview.length > 0 && <Box sx={{
            display: 'grid',
            width: '100%',
            gap: 4,
            rowGap: 2,
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          }}>
            {citiesWithPreview.map((item) => <Box key={item.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'stretch', gap: 1 }}>
              <DashboardPreviewImages photos={item.photos} size={50} count={5} />
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2}}>
                <Typography variant="caption" color="textDisabled" sx={{ lineHeight: 1 }}>{item.name}</Typography>
                {inView && <SolidChip count={item.photos.length} />}
              </Box>
            </Box>)}
          </Box>}
          {citiesWithoutPreview.length > 0 && (citiesWithoutPreview.length > 10 ? inView : true) && <Stack direction={'row'} sx={{ flexWrap: 'wrap',
            borderTop: '1px dotted', borderColor: 'divider', pt: 1, mt: 1,
            gap: 2, overflow: 'auto', height: citiesWithoutPreview.length > 10 ? '250px' : 'auto' }} >
            {citiesWithoutPreview.map((item) => <Box key={item.name} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="caption" color="textDisabled" sx={{ lineHeight: 1 }}>{item.name}</Typography>
              {inView && <SolidChip count={item.photos.length} />}
            </Box>)}
          </Stack>}
        </Box>
      </Box>
    </SettingsSection>
  );
}
