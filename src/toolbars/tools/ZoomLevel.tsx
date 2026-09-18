import NewChip from '@/components/NewChip';
import { usePipelineCanvas } from '@/hooks/usePipelineCanvas';
import { useEffect, useState } from 'react';

export default function ZoomLevel() {
  const { actionsRef } = usePipelineCanvas();
  const [zoom, setZoom] = useState(() => actionsRef.current.getZoom());

  useEffect(() => {
    setZoom(actionsRef.current.getZoom());

    const handleZoomChanged = (event: Event) => {
      const nextZoom = (event as CustomEvent<number>).detail;

      if (typeof nextZoom === 'number' && Number.isFinite(nextZoom)) {
        setZoom(nextZoom);
      }
    };

    window.addEventListener('pipeline:zoom-changed', handleZoomChanged);
    return () => window.removeEventListener('pipeline:zoom-changed', handleZoomChanged);
  }, []);

  return (
    <NewChip
      count={`${Math.round(zoom * 100)}%`}
      label=""
      fontSize={12}
      borderless
    />
  );
}
