import { Box, IconButton } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import AlbumScrollerItem from '@/middleware/interface/scroller/AlbumScrollerItem';
import TimelineScroller from '@/middleware/interface/scroller/TimelineScroller';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  photos: GalleryPhoto[];
  rows?: number;
  columns?: number;
};

const ITEM_WIDTH = 300;
const GAP = 32;
const ANIMATION_MS = 350;
const INPUT_LOCK_MS = 50;
const MOUNT_RADIUS = 1;

// How far apart (ms) two consecutive photos need to be before we consider
// them part of a different "batch". Tune to taste.
const BATCH_GAP_MS = 3 * 60 * 60 * 1000; // 3 hours

// TODO: point this at whatever timestamp field GalleryPhoto actually has.
function getPhotoTime(photo: GalleryPhoto): number {
  return photo.takenAtTs * 1000;
}

/**
 * Splits photos into batches whenever the time gap between consecutive
 * photos exceeds BATCH_GAP_MS. Assumes `photos` is already sorted by time.
 */
function groupPhotosByTime(photos: GalleryPhoto[]): GalleryPhoto[][] {
  if (photos.length === 0) return [];

  const batches: GalleryPhoto[][] = [];
  let currentBatch: GalleryPhoto[] = [photos[0]];

  for (let i = 1; i < photos.length; i++) {
    const prevTime = getPhotoTime(photos[i - 1]);
    const time = getPhotoTime(photos[i]);

    if (Math.abs(time - prevTime) > BATCH_GAP_MS) {
      batches.push(currentBatch);
      currentBatch = [photos[i]];
    } else {
      currentBatch.push(photos[i]);
    }
  }
  batches.push(currentBatch);

  return batches;
}

/**
 * Splits any batch bigger than maxSize into contiguous sub-groups of at
 * most maxSize, preserving original order and never mixing across batches.
 */
function splitOversizedBatches(
  batches: GalleryPhoto[][],
  maxSize: number
): GalleryPhoto[][] {
  const result: GalleryPhoto[][] = [];
  for (const batch of batches) {
    if (batch.length <= maxSize) {
      result.push(batch);
      continue;
    }
    for (let i = 0; i < batch.length; i += maxSize) {
      result.push(batch.slice(i, i + maxSize));
    }
  }
  return result;
}

export default function AlbumScroller({
  photos,
}: Props) {
  const [current, setCurrent] = useState(0);
  const rows = useSettingsStoreSelector((state) => state.scrollerRows)
  const columns = useSettingsStoreSelector((state) => state.scrollerColumns)
  const groupedByBatches = useSettingsStoreSelector((state) => state.scrollerGroupedByBatches)
  const previewPhotoObj = useSettingsStoreSelector((s) => s.previewPhotoObj);
  const blockSize = rows * columns;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const blocks = useMemo(() => {
    if (!groupedByBatches) {
      const flat: GalleryPhoto[][] = [];
      for (let i = 0; i < photos.length; i += blockSize) {
        flat.push(photos.slice(i, i + blockSize));
      }
      return flat;
    }

    const timeBatches = groupPhotosByTime(photos);
    return splitOversizedBatches(timeBatches, blockSize);
  }, [photos, blockSize, groupedByBatches]);

  const blockIndexByPhotoId = useMemo(() => {
    const map = new Map<string, number>();

    blocks.forEach((block, blockIndex) => {
      block.forEach((photo) => {
        map.set(photo.id, blockIndex);
      });
    });

    return map;
  }, [blocks]);

  const blockCount = blocks.length;
  const maxIndex = Math.max(0, blockCount - 1);
  const previewRaf = useRef<number | null>(null);


  useEffect(() => {
    setCurrent(0);
  }, [photos]);

  // Block boundaries are totally different once grouping mode changes,
  // so reset to the start rather than trying to preserve position.
  useEffect(() => {
    setCurrent(0);
  }, [groupedByBatches]);

  useEffect(() => {
    if (!previewPhotoObj) return;

    if (previewRaf.current !== null) {
      cancelAnimationFrame(previewRaf.current);
    }

    previewRaf.current = requestAnimationFrame(() => {
      const nextIndex = blockIndexByPhotoId.get(previewPhotoObj.id);
      if (nextIndex == null) return;

      setCurrent((index) => (index === nextIndex ? index : nextIndex));
    });

    return () => {
      if (previewRaf.current !== null) {
        cancelAnimationFrame(previewRaf.current);
      }
    };
  }, [previewPhotoObj, blockIndexByPhotoId]);

  useEffect(() => {
    setCurrent((v) => Math.min(v, maxIndex));
  }, [maxIndex]);

  const blockWidth = ITEM_WIDTH * columns;
  const step = blockWidth + GAP;
  const offsetX = -current * step;

  const lockRef = useRef(false);
  const unlockTimer = useRef<number | null>(null);

  const triggerLock = useCallback(() => {
    lockRef.current = true;
    if (unlockTimer.current !== null) clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(() => {
      lockRef.current = false;
      unlockTimer.current = null;
    }, INPUT_LOCK_MS);
  }, []);

  const go = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      setCurrent((v) => Math.max(0, Math.min(maxIndex, v + dir)));
      triggerLock();
    },
    [maxIndex, triggerLock]
  );

  useEffect(() => {
    return () => {
      if (unlockTimer.current !== null) clearTimeout(unlockTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go]);



  useEffect(() => {
    const THRESHOLD = 15;
    const onWheel = (e: WheelEvent) => {
      if (lockRef.current) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < THRESHOLD) return;
      go(delta > 0 ? 1 : -1);
    };

    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, [go]);

  const mountedIndices = useMemo(() => {
    const start = Math.max(0, current - MOUNT_RADIUS);
    const end = Math.min(maxIndex, current + MOUNT_RADIUS);
    const result: number[] = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  }, [current, maxIndex]);

  const getBlock = useCallback(
    (index: number) => blocks[index] ?? [],
    [blocks]
  );

  const centeredOffset =
    (containerWidth - blockWidth) / 2;

  return (
    <Box ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        overscrollBehavior: 'contain',
      }}
    >
      <IconButton
        disabled={current === 0}
        onClick={() => go(-1)}
        sx={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 99 }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        disabled={current === maxIndex}
        onClick={() => go(1)}
        sx={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 99 }}
      >
        <ChevronRight />
      </IconButton>

      <Box
        onTransitionEnd={() => {
          lockRef.current = false;
        }}
        sx={{
          position: 'relative',
          height: '100%',
          transform: `translate3d(${centeredOffset + offsetX}px,0,0)`,
          transition: `transform ${ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          willChange: 'transform',
        }}
      >
        {mountedIndices?.map((index) => (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', position: 'absolute', top: 0, left: index * step, height: '100%', width: blockWidth }}
          >
            <AlbumScrollerItem
              photos={getBlock(index)}
              rows={rows}
              columns={columns}
              offset={index - current}
            />
          </Box>
        ))}
      </Box>

      <TimelineScroller current={current} maxIndex={maxIndex} onChange={(i) => setCurrent(i)} lockRef={lockRef} inputLockMs={INPUT_LOCK_MS} />
    </Box>
  );
}
