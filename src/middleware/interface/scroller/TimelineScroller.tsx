import { Box } from '@mui/material';
import React, { useCallback, useRef } from 'react';

type Props = {
  current: number;
  maxIndex: number;
  onChange: (index: number) => void;
  lockRef: React.MutableRefObject<boolean>;
  inputLockMs?: number;
};

export default function TimelineScroller({ current, maxIndex, onChange, lockRef, inputLockMs = 350 }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const updateIndexFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const x = clientX - rect.left;
      const frac = Math.max(0, Math.min(1, x / rect.width));
      const next = Math.round(frac * maxIndex);
      onChange(next);
    },
    [maxIndex, onChange]
  );

  const onTrackPointerDown = useCallback((e: any) => {
    const target = e.currentTarget as Element;
    (target as Element).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    updateIndexFromClientX(e.clientX);
    lockRef.current = true;
  }, [updateIndexFromClientX, lockRef]);

  const onTrackPointerMove = useCallback((e: any) => {
    if (!draggingRef.current) return;
    updateIndexFromClientX(e.clientX);
  }, [updateIndexFromClientX]);

  const onTrackPointerUp = useCallback((e: any) => {
    const target = e.currentTarget as Element;
    try { (target as Element).releasePointerCapture(e.pointerId); } catch {}
    draggingRef.current = false;
    window.setTimeout(() => {
      lockRef.current = false;
    }, inputLockMs);
  }, [inputLockMs, lockRef]);

  return (
    <Box
      onPointerDown={onTrackPointerDown}
      onPointerMove={onTrackPointerMove}
      onPointerUp={onTrackPointerUp}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 24,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 199,
        pointerEvents: 'auto',
      }}
    >
      <Box ref={(el) => (trackRef.current = el)} sx={{ width: '90%', height: 6, bgcolor: 'rgba(0,0,0,0.12)', borderRadius: 3, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            boxShadow: 2,
            cursor: 'pointer',
          }}
          style={{ left: `${(maxIndex > 0 ? (current / maxIndex) * 100 : 0)}%` }}
        />
      </Box>
    </Box>
  );
}
