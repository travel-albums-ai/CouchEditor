import UPlotChart from '@/components/UPlotChart';
import { Box, Typography } from '@mui/material';
import { cloneElement, useEffect, useState } from 'react';

export default function IndexerMetricCard({ line, object, format, showChart = true }: { line: string; object?: { label?: string; icon?: JSX.Element }; format?: (value: string) => string; showChart?: boolean }) {
  const [values, setValues] = useState<number[]>([]);

  useEffect(() => {
    const raw = line.split(':')[1]?.trim() ?? line;
    const num = Number(raw);
    setValues(prev => {
      const next = [...prev, Number.isNaN(num) ? 0 : num];
      return next.length > 50 ? next.slice(-50) : next;
    });
  }, [line]);

  return (
    <Box sx={{
      p: 1,
      boxShadow: 2,
      display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center',
      bgcolor: theme => `${theme.palette.background.paper}42`, flex: '1 1 auto',
      borderRadius: 2,
      borderColor: 'divider', position: 'relative'
    }}>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center', gap: 1,
          // borderBottom: '1px dotted', borderColor: 'divider',
          // pb: 0.5, mb: 0.5,
          width: '100%' }}>
          {object?.icon && cloneElement(object.icon, { size: 16 })}
          <Typography variant="caption" color="textDisabled" sx={{ lineHeight: 1}}>{object?.label}</Typography>
        </Box>
        <Typography><strong>{format ? format(line.split(':')[1]) : line.split(':')[1]}</strong></Typography>
      </Box>

      {showChart && (
        <Box sx={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, opacity: 0.5 }}>
          <UPlotChart data={values} />
        </Box>
      )}
    </Box>
  )
}
