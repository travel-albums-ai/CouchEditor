import { useLabelsStoreSelector } from '@/context/labelsStore';
import { Box, Typography } from '@mui/material';
import stc from 'string-to-color';

export default function ElementLabels({ photoId }: { photoId?: string }) {
  const allLabels = useLabelsStoreSelector((state) => state.labels)

  const labels = photoId ? allLabels[photoId] ?? [] : allLabels

  const uniqueLabels = Object.values(labels)
    .flatMap(photoLabels => photoLabels)
    .filter(label => label.score > 0.6)
    .reduce((acc, label) => {
      const existing = acc.find(l => l.description === label.description)
      if (existing) {
        existing.count += 1
      } else {
        acc.push({ description: label.description, count: 1 })
      }
      return acc
    }, [] as { description: string, count: number }[])
    .sort((a, b) => b.count - a.count)


  return (<>
    <Box sx={{ display: 'flex', userSelect: 'all', flexDirection: 'row', gap: 0.75, maxHeight: '400px', p: 0, flexWrap: 'wrap', overflowY: 'auto' }}>
      {uniqueLabels.map((label, index) => <Box key={index} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: `${stc(label.description)}18`, borderRadius: 2, px: 0.75, py: 0.5, gap: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption" color="textDisabled">{`[${label.count}]`}</Typography>
        <Typography variant="caption">{`${label.description} `}</Typography>
        {/* <Typography variant="caption" color="textDisabled">{`(${(label.score * 100).toFi+`9`                    9 `xed(1)}%)`}</Typography> */}

      </Box>)}
    </Box>
  </>)
}
