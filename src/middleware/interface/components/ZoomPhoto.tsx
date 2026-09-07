import { useSettingsStoreSelector } from '@/context/settingsStore';
import { composeUrl } from '@/lib/thumbnailService';
import { Box, Typography } from '@mui/material';
import { FileQuestionMark } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

export default function ZoomPhoto() {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);
  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  const photo = previewPhotoObj

  // Track container size via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reset loaded state when photo changes
  useEffect(() => {
    setImgLoaded(false);
    setImgNaturalSize({ w: 0, h: 0 });
  }, [photo?.id]);

  const initialScale = useCallback((): number => {
    const iw = imgNaturalSize.w || photo?.width || 1;
    const ih = imgNaturalSize.h || photo?.height || 1;
    const cw = containerSize.w || 1;
    const ch = containerSize.h || 1;

    const padding = 0.98; // slight breathing room
    return Math.min((cw / iw) * padding, (ch / ih) * padding);
  }, [imgNaturalSize, photo?.width, photo?.height, containerSize]);

  useEffect(() => {
    if (!imgLoaded || !transformRef.current) return;
    const scale = initialScale();
    transformRef.current.setTransform(0, 0, scale, 0);
    requestAnimationFrame(() => {
      transformRef.current?.centerView(scale, 0);
    });
  }, [imgLoaded, containerSize, initialScale]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImgNaturalSize({ w: naturalWidth, h: naturalHeight });
    setImgLoaded(true);
  }, []);

  if (!photo) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, height: '100%' }}>
        <FileQuestionMark size={20} />
        <Typography color="textDisabled" variant="subtitle2">Select a photo to continue</Typography>
      </Box>
    );
  }

  const scale = initialScale();

  return (
    <Box
      ref={containerRef}
      sx={{ width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {containerSize.w > 0 && (
        <TransformWrapper
          ref={transformRef}
          key={photo.id}
          initialScale={scale}
          minScale={scale * 0.25}
          maxScale={scale * 10}
          centerOnInit
          centerZoomedOut
          doubleClick={{ mode: 'reset' }}
          smooth
          limitToBounds={false}
          velocityAnimation={{ disabled: true }}
          panning={{ velocityDisabled: true }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            <img
              ref={imgRef}
              src={composeUrl(photo, true)}
              alt={photo.title}
              loading="lazy"
              decoding="async"
              draggable={false}
              onLoad={handleImageLoad}
              style={{
                display: 'block',
                opacity: imgLoaded ? 1 : 0,
                transition: 'none',
              }}
            />
          </TransformComponent>
        </TransformWrapper>
      )}
    </Box>
  );
}
