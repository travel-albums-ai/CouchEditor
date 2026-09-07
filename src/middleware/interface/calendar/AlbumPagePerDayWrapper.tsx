import { useTransform_PhotosByMoments } from '@/hooks/useTransform_PhotosByMoments';
import AlbumPagePerDayItem from '@/middleware/interface/calendar/AlbumPagePerDayItem';
import MiniCalendar from '@/middleware/interface/calendar/MiniCalendar';
import AlbumMapPanel from '@/pages/components/AlbumMapPanel';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function AlbumPagePerDayWrapper({ photos }: { photos: any[] }) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const photosByMoments = useTransform_PhotosByMoments(photos);

  const selectedPhotos = (selectedDay && selectedMoment && selectedPlace) ? photosByMoments.find((d) => d.label === selectedDay)?.moments.find((m) => m.label === selectedMoment)?.locations.find((l) => l.label === selectedPlace)?.photos : null;
  const allMoments = photosByMoments.flatMap((day) => day.moments.flatMap((moment) => day.label + ", " + moment.label));

  return (
    <Box
      component="section"
      aria-label="Photos in album"
      sx={{
        flex: 1,
        display: 'flex',
        minHeight: 0,
        gap: 2
      }}
    >

      <Box sx={{  width: '500px', alignSelf: 'stretch', justifyContent: 'space-between', display: 'flex', flexDirection: 'column', gap: 1  }}>

        <MiniCalendar
          year={dayjs(selectedDay).year()}
          month={dayjs(selectedDay).month() + 1}
          highlightMoments={[
            ...allMoments.map((moment) => dayjs(moment)),
          ]}
          selectedDay={dayjs(selectedDay)}
          selectedMoment={dayjs(selectedDay + ", " + selectedMoment)}
        />

        {selectedPhotos && <AlbumMapPanel photos={selectedPhotos} height={950} interactive={true} />}
      </Box>

      <Box sx={{ flex: 1, minHeight: 0 }}>

        <Box sx={{ overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: 2, pt: 2, px: 1 }}>
          {photosByMoments.filter((_,i) => i < 10).map((day, index) => (
            <Box key={day.label} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: index !== 0 ? 4 : 0, flexWrap: 'nowrap' }}
              onMouseOver={() => setSelectedDay(day.label)}
            >
                📅 {day.label}
              {day.moments.map((moment) => (
                <Box key={moment.label} onMouseOver={() => setSelectedMoment(moment.label)}>
                  {moment.locations.map((location, index) => (
                    <Box key={location.label}
                      onMouseOver={() => setSelectedPlace(location.label)}
                      sx={{
                        display: 'flex', flexDirection: 'row',
                        gap: 2, py: 2,
                        pt: index !== 0 ? 4 : 0, flexWrap: 'nowrap',
                      }}>

                      <Box sx={{
                        width: '100%',
                        overflowY: 'auto',
                      }}>
                        <AlbumPagePerDayItem
                          day={{
                            label: `${day.label} ${moment.label} at ${location.label} (${location.photos.length})`,
                            photos: location.photos,
                          }}
                          index={index}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
