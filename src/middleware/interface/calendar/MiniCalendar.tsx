import { Box, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

type Props = {
  year: number
  month: number // 1-12
  highlightMoments?: Dayjs[]
  selectedDay?: Dayjs
  selectedMoment?: Dayjs
}

export default function MiniCalendar({
  year,
  month,
  highlightMoments = [],
  selectedDay,
  selectedMoment,
}: Props) {
  const first = dayjs().year(year).month(month - 1).date(1)
  const days = Array.from(
    { length: first.daysInMonth() },
    (_, i) => first.date(i + 1)
  )

  const offset = first.day()

  return (
    <Box sx={{ }}>
      <Typography sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 600, fontSize: 14, py: 2, px: 1 }} color="text.secondary">
        {first.format('MMMM YYYY')}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0.65,
        }}
      >
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Typography
            key={i}
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}
          >
            {d}
          </Typography>
        ))}

        {Array.from({ length: offset }, (_, i) => <Box key={i} />)}

        {days.map(day => {
          const moments = highlightMoments.filter(m => m.isSame(day, 'day'))
          const selected = selectedDay?.isSame(day, 'day')

          return (
            <Box
              key={day.date()}
              sx={{
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  fontSize: 14,
                  fontWeight: selected || moments.length ? 600 : 400,
                  bgcolor: selected ? 'primary.main' : 'transparent',
                  color: selected
                    ? 'primary.contrastText'
                    : 'text.primary',
                  border: moments.length && !selected ? '2px dotted' : 'none',
                  borderColor: 'primary.main',
                }}
              >
                {day.date()}
              </Box>

              {selected && moments.length > 0 && (
                <Box sx={{
                  // display: 'grid',
                  // gridTemplateColumns: `repeat(4, 4px)`,
                  display: 'flex',
                  gap: 0.35, position: 'absolute', bottom: 4 }}>
                  {moments.map((moment, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: selectedMoment?.isSame(moment) ? '3px' : '1px',
                        height: 4,
                        // borderRadius: '50%',
                        bgcolor: selectedMoment?.isSame(moment)
                          ? 'primary.dark'
                          : 'text.primary',
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
