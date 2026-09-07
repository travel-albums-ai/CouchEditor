
import { useFilterPhotos, useFilterStoreSelector } from '@/context/filterStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import SettingDateRow from '@/middleware/windows/settings/components/SettingDateRow';
import SparklineDates from '@/middleware/windows/settings/SparklineDates';
import { Box, IconButton } from '@mui/material';
import { PlusCircle, Square, SquareCheck, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import stc from 'string-to-color';

export default function DatesFilter() {
  const { toggleDates, addDates, deleteDates } = useFilterPhotos()
  const dates = useFilterStoreSelector((state) => state.dates)
  const [startDate, setStartDate] = useState<number>(0)
  const [endDate, setEndDate] = useState<number>(0)
  const rawPhotos = useUnfilteredPhotos_GLOBAL();
  const allPhotos = useFilteredPhotos_GLOBAL()
  const { t } = useTranslation()

  const addExample = () => {
    addDates(startDate, endDate, t('exampleDateRange'))
    setStartDate(0)
    setEndDate(0)
  }

  const sortedRawPhotos = rawPhotos ? [...rawPhotos].sort((a, b) => a.takenAtTs - b.takenAtTs) : []

  const [nowFallback, setNowFallback] = useState<number | null>(null);

  useEffect(() => {
    setNowFallback(Date.now());
  }, []);

  const firstPhotoDate = sortedRawPhotos[0]?.takenAtTs ? sortedRawPhotos[0].takenAtTs * 1000 : (nowFallback ?? 0)
  const lastPhotoDate = sortedRawPhotos[sortedRawPhotos.length - 1]?.takenAtTs ? sortedRawPhotos[sortedRawPhotos.length - 1].takenAtTs * 1000 : (nowFallback ?? 0)

  return <Box sx={{ p : 2 }}>

    <Box sx={{ position: 'relative', mb: 1 }}>
      {/* <DateRangeSelector /> */}
      <SparklineDates photos={rawPhotos} photosFiltered={allPhotos} />
      {/* <SparklineDates photos={allPhotos} /> */}

      { dates.map((d, i) => (
        <Box key={i} sx={{
          position: 'absolute',
          top: 0,
          opacity: d.active ? 0.25 : 0.75,
          left: `${((d.startDate - firstPhotoDate) / (lastPhotoDate - firstPhotoDate)) * 100}%`,
          width: `${((d.endDate - d.startDate) / (lastPhotoDate - firstPhotoDate)) * 100}%`,
          height: '100%',
          backgroundColor: d.active ? stc(`${d.startDate}${d.endDate}`) : 'transparent',
          border: `1px dotted ${stc(`${d.startDate}${d.endDate}`)}`,
        }} >
        </Box>
      )) }
    </Box>

    <Box  sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 1, borderBottom: '1px solid', borderColor: 'divider', mb: 1, pb: 1 }}>
      <SettingDateRow value={startDate} onChange={setStartDate} />
      <SettingDateRow value={endDate} onChange={setEndDate} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <IconButton color="primary" onClick={addExample}><PlusCircle size={ 20} /></IconButton>
      </Box>

    </Box>


    { dates.map((d, i) => (
      <Box key={i} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 1, py: 0.5 }}>

        <Box sx={{ flex: '0 0 16px', width: 16, height: 16, backgroundColor: stc(`${d.startDate}${d.endDate}`), borderRadius: '50%' }} />

        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <SettingDateRow value={d.startDate} disabled fieldLabel="Start Date" />
          <SettingDateRow value={d.endDate} disabled fieldLabel="End Date" />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <IconButton color={d.active ? "primary" : "default"} onClick={() => toggleDates(i)}>
            {d.active && <SquareCheck size={16} />}
            {!d.active && <Square size={16} />}
          </IconButton>
          <IconButton color="error" onClick={() => deleteDates(i)}><Trash size={ 16} /></IconButton>
        </Box>
      </Box>
    )) }



  </Box>;
}
