import { useEffect, useMemo, useRef } from 'react';
import uPlot from 'uplot';

type SparklineProps = {
  data: Record<string, number>;
  dataFiltered?: Record<string, number>;
  width?: number;
  height?: number;
};

export default function SparklinePhotos({
  data,
  dataFiltered,
  width = 120,
  height = 40,
}: SparklineProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const uplotRef = useRef<uPlot | null>(null);

  console.log('Rendering SparklinePhotos with data:', data, dataFiltered);

  const chartData = useMemo(() => {
    const sorted = Object.entries(data)
      .sort(([a], [b]) => +new Date(a) - +new Date(b));

    const x = sorted.map(([date]) => new Date(date).getTime() / 1000);
    const y = sorted.map(([, value]) => value);
    const yFiltered = dataFiltered ? sorted.map(([date]) => dataFiltered[date] || null) : null;

    return [x, y, ...(yFiltered ? [yFiltered] : [])] as const;
  }, [data, dataFiltered]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new uPlot(
      {
        width,
        height,

        cursor: {
          show: false,
        },

        select: {
          show: false,
        },

        legend: {
          show: false,
        },

        axes: [
          {
            show: false,
          },
          {
            show: false,
          },
        ],

        scales: {
          x: {
            time: true,
          },
        },

        series: [
          {},
          {
            stroke: '#BBBBBB42',
            width: 1,
          },
          {
            stroke: '#90caf9',
            width: 2,
            spanGaps: false,

          },
        ],

        padding: [4, 4, 4, 4],
      },
      chartData,
      chartRef.current
    );

    uplotRef.current = chart;

    return () => {
      chart.destroy();
    };
  }, []);

  useEffect(() => {
    uplotRef.current?.setData(chartData);
  }, [chartData]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
}
