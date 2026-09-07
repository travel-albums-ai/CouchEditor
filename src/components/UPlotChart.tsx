import { useEffect, useRef } from 'react';
import uPlot from 'uplot';

type Props = {
  data: number[];
  color?: string;
};

export default function UPlotChart({ data, color = '#1976d2' }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const uplotRef = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const x = data.map((_, i) => i);
    const seriesData = [x, data];

    const opts: any = {
      width: el.clientWidth || 300,
      legend: { show: false },
      height: el.clientHeight || 80,
      axes: [{ show: false }, { show: false }],
      scales: { x: { auto: false }, y: { auto: true } },
      series: [
        { show: false },
        {
          stroke: color,
          width: 2,
          fill: `${color}33`,
          show: true,
          points: { show: false },
        },
      ],
      plugins: [],
      hooks: {},
      cursor: { drag: { setScale: false }, points: { show: false } },
    };

    if (uplotRef.current) {
      try { uplotRef.current.setData(seriesData); } catch (e) { /* ignore */ }
    } else {
      uplotRef.current = new (uPlot as any)(opts, seriesData, el);
    }

    const ro = new ResizeObserver(() => {
      if (!uplotRef.current || !el) return;
      try { uplotRef.current.setSize({ width: el.clientWidth, height: el.clientHeight }); } catch (e) { /**/ }
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      if (uplotRef.current) {
        try { uplotRef.current.destroy(); } catch (e) { /**/ }
        uplotRef.current = null;
      }
    };
  }, [data, color]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}
