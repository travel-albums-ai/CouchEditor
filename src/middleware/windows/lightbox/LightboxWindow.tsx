import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import useKeyboardNav from '@/hooks/useKeyboardNav';
import useWheelNav from '@/hooks/useWheelNav';
import LightboxBackground from '@/middleware/windows/lightbox/LightboxBackground';
import LightboxFilmstripNg from '@/middleware/windows/lightbox/LightboxFilmstripNg';
import LightboxViewer from '@/middleware/windows/lightbox/LightboxViewer';
import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function LightboxWindow() {
  const lightboxOpen = useSettingsStoreSelector(s => s.lightboxOpen);
  const lightboxImages = useSettingsStoreSelector(s => s.lightboxImages);
  const previewPhotoObj: string | undefined = useSettingsStoreSelector(s => s.previewPhotoObj);
  const { setPreviewPhotoObj, setSetting } = useSettings();

  const photos = lightboxImages

  const [currentIndex, setCurrentIndex] = useState(0);

  const showWindow = lightboxOpen === true;

  const close = useCallback(() => {
    setSetting(prev => ({
      ...prev,
      lightboxOpen: false,
    }));
  }, [setSetting]);

  const initialIndex = useMemo(() => {
    if (!previewPhotoObj || photos.length === 0) {
      return 0;
    }

    const index = photos.findIndex(p => p.id === previewPhotoObj.id);

    return index >= 0 ? index : 0;
  }, [photos, previewPhotoObj]);

  useEffect(() => {
    if (showWindow) {
      setCurrentIndex(initialIndex);
    }
  }, [showWindow, initialIndex]);

  const currentPhoto = photos[currentIndex];

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= photos.length) return;
    setCurrentIndex(index);
    const photo = photos[index];
    if (photo) setPreviewPhotoObj(photo);
  }, [photos, setPreviewPhotoObj]);


  const previous = useCallback(() => {
    setCurrentIndex(index => {
      const nextIndex = Math.max(0, index - 1);
      const photo = photos[nextIndex];
      if (photo) setPreviewPhotoObj(photo);
      return nextIndex;
    });
  }, [photos, setPreviewPhotoObj]);

  const next = useCallback(() => {
    setCurrentIndex(index => {
      const nextIndex = Math.min(photos.length - 1, index + 1);
      const photo = photos[nextIndex];
      if (photo) setPreviewPhotoObj(photo);
      return nextIndex;
    });
  }, [photos, setPreviewPhotoObj]);

  const viewerRef = useRef<HTMLDivElement | null>(null);

  useWheelNav({ enabled: showWindow, ref: viewerRef, next, previous, threshold: 10, throttleMs: 150 });

  useKeyboardNav({ enabled: showWindow, next, previous, close });

  useEffect(() => {
    if (!showWindow) return;

    const start = Math.max(0, currentIndex - 5);
    const end = Math.min(photos.length - 1, currentIndex + 5);

    for (let index = start; index <= end; index++) {
      const photo = photos[index];
      if (!photo) continue;
      const image = new Image();
      image.src = photo
    }
  }, [showWindow, currentIndex, photos]);

  // if (!showWindow || !currentPhoto) return null;

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, width: '100%', height: '100%', overflow: 'hidden', gap: 1, position: 'relative' }}>
        <LightboxBackground photo={currentPhoto} />
        <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 0, minHeight: 0, minWidth: 0, overflow: 'hidden', position: 'relative', zIndex: 1 }}>

          <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, width: '100%', height: '100%', overflow: 'hidden', gap: 1 }}>
            <Box
              ref={viewerRef}
              sx={{ flex: 1, minHeight: 0, m: 2, minWidth: 0, display: 'flex', borderRadius: 2, gap: 2, alignItems: 'center', justifyContent: 'center', }}
            >
              <LightboxViewer photo={currentPhoto} />
            </Box>
          </Box>

          <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 1, p: 1, overflow: 'visible' }}>
            <LightboxFilmstripNg photos={photos} currentIndex={currentIndex} goTo={goTo} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
