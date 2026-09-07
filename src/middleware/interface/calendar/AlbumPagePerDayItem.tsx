import { useDescriptionsStoreSelector } from '@/context/descriptionsStore';
import { usePhotosByDay } from '@/hooks/useTransform_PhotosByDays';
import AllPhotosGridVirtuoso from '@/pages/components/AllPhotosGridVirtuoso';
import DayAnalyzer from '@/robot/DayAnalyzer';
import { Box, Divider, Typography } from '@mui/material';
import { Calendar } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function AlbumPagePerDayItem({ day, index, children }: { day: ReturnType<typeof usePhotosByDay>[number], index: number, children?: React.ReactNode }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  const descriptionStore = useDescriptionsStoreSelector(state => state.descriptions);
  const uniquePlaces =  [...new Set(day.photos?.map(p => p?.city).map(c => c?.name))]

  const contextDescriptions = (day.photos || [])
    .map(photo => descriptionStore.find(d => d.id === photo.id))
    .filter(d => d !== undefined)
    .map(d => d.description)

  return (
    <Box ref={ref} key={day.label} id="AlbumPagePerDayItem"
      sx={{ display: 'flex', flexDirection: 'row', height: '100%', gap: 2, py: 4, pt: index !== 0 ? 4 : 0, flexWrap: 'nowrap' }}
    >
      <Box sx={{ width: '100%' }}>
        <Divider sx={{ mb: 2 }} >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={16} />
            <Typography variant="caption" sx={{ lineHeight: 1 }} color="textDisabled"> {day.label}</Typography>
          </Box>
        </Divider>
        {children}
        <Box sx={{ pb: 2 }}>
          {contextDescriptions.length > 0 && contextDescriptions.length === day.photos.length && (
            <DayAnalyzer
              context={{
                descriptions: contextDescriptions.join(', '),
                photoLocations: 'Places where photos were taken: ' + uniquePlaces.join(', '),
              }}
            />
          )}
        </Box>
        <Box sx= {{ height: '600px' }}>
          {inView && <AllPhotosGridVirtuoso photos={day.photos} />}
        </Box>
      </Box>
    </Box>
  )
}
