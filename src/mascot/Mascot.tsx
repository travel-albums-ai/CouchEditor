import { useNotifications } from '@/context/notificationsStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import TwinLensMascot from '@/mascot/TwinLensMascot';
import { Box, Tooltip } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'twin-lens-mascot-x';
const MASCOT_SIZE = 100;
const BOTTOM = 10;

export default function Mascot() {
  const loading = useSettingsStoreSelector((state) => state.loading);
  const { addNotification } = useNotifications()
  const [x, setX] = useState<number | null>(null);

  const draggingRef = useRef(false);
  const dragOffsetRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  // Restore saved position
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = Number(saved);

      if (Number.isFinite(parsed)) {
        setX(parsed);
        return;
      }
    }

    // Default: bottom-right
    setX(window.innerWidth - MASCOT_SIZE);
  }, []);

  // Keep mascot inside the viewport after resizing
  useEffect(() => {
    const handleResize = () => {
      setX((current) => {
        if (current === null) return current;

        const maxX = Math.max(0, window.innerWidth - MASCOT_SIZE);
        const nextX = Math.min(Math.max(0, current), maxX);

        if (nextX !== current) {
          localStorage.setItem(STORAGE_KEY, String(nextX));
        }

        return nextX;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (x === null) return;

      draggingRef.current = true;
      setDragging(true);

      // Remember where inside the mascot the user grabbed it.
      dragOffsetRef.current = event.clientX - x;

      event.currentTarget.setPointerCapture(event.pointerId);

      event.preventDefault();
    },
    [x],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;

      const maxX = Math.max(0, window.innerWidth - MASCOT_SIZE);

      const nextX = Math.min(
        Math.max(
          0,
          event.clientX - dragOffsetRef.current,
        ),
        maxX,
      );

      setX(nextX);
    },
    [],
  );

  const stopDragging = useCallback(() => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    setDragging(false);

    setX((current) => {
      if (current !== null) {
        localStorage.setItem(STORAGE_KEY, String(current));
      }

      return current;
    });
  }, []);

  if (x === null) {
    return null;
  }

  const addRandomNotification = () => {
    const phrases = [
      'Hello.  The '
    ]

    addNotification('SpotAI', phrases[0])
  }

  return (
    <Tooltip title="This is SpotAI. Drag to reposition" placement="top" arrow>
      <Box
        onDoubleClick={addRandomNotification}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        sx={{
          position: 'fixed',
          left: `${x}px`,
          bottom: `${BOTTOM}px`,

          width: `${MASCOT_SIZE}px`,
          height: `${MASCOT_SIZE}px`,

          zIndex: 1000,

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          cursor: dragging ? 'grabbing' : 'grab',

          pointerEvents: 'auto',

          touchAction: 'none',
          userSelect: 'none',

          '& svg': {
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          },
        }}
      >

        <TwinLensMascot loading={loading} />

      </Box>
    </Tooltip>
  );
}
