import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import LightboxViewer from './LightboxViewer';

import AlbumsMetaDetails from '@/components/AlbumsMetaDetails';
import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import SettingsSection from '@/components/SettingsSection';
import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import useKeyboardNav from '@/hooks/useKeyboardNav';
import useWheelNav from '@/hooks/useWheelNav';
import { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';
import DescribePhoto from '@/middleware/interface/preview/DescribePhoto';
import EXIFSection from '@/middleware/windows/lightbox/EXIFSection';
import LightboxBackground from '@/middleware/windows/lightbox/LightboxBackground';
import LightboxFilmstripNg from '@/middleware/windows/lightbox/LightboxFilmstripNg';
import LocationSection from '@/middleware/windows/lightbox/LocationSection';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

export default function LightboxWindow() {
  const lightboxOpen = useSettingsStoreSelector(s => s.lightboxOpen);
  const previewPhotoObj: GalleryPhoto | undefined = useSettingsStoreSelector(s => s.previewPhotoObj);

  const width = useAlbumPhotoCardStoreSelector(state => state.width);
  const height = useAlbumPhotoCardStoreSelector(state => state.height);

  const { setPreviewPhotoObj, setSetting } = useSettings();

  const { type_name = '', id = '' } = useParams();

  const sections = useSections_GLOBAL();
  const photosFiltered = useFilteredPhotos_GLOBAL();

  const showAll = type_name === '';

  const foundSection = sections?.find(s => s.type === type_name);

  const foundSet = foundSection?.data?.find((d: any) => d.name === id);

  const photos = showAll ? photosFiltered : foundSet?.photos || [];

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
      image.src = composeUrl(photo, true);
    }
  }, [showWindow, currentIndex, photos]);

  if (!showWindow || !currentPhoto) return null;

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

        {currentPhoto && <Box key={currentPhoto.id} sx={{
          flex: '0 0 500px',
          minHeight: 0,
          minWidth: 0,
          overflowY: 'auto',
          p: 2,
          zIndex: 2,
          borderLeft: '2px solid',
          borderColor: 'divider',
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', flex: 1, py: 1, justifyContent: 'space-between' }}>

            <GenericToggleButtonGroup
              items={[{
                tooltip: "Previous photo",
                onClick: () => previous(),
                icon: <ChevronLeft />,
                selected: false,
                disabled: currentIndex === 0,
              },
              {
                tooltip: "Next photo",
                onClick: () => next(),
                icon: <ChevronRight />,
                selected: false,
                disabled: currentIndex === photos.length - 1,
              }
              ] as GenericToggleButtonProps[]}
              variant="outlined"
            />

            <Box>
              <GeneralRegistryToolbar group="lightbox" />
            </Box>
          </Box>



          <LocationSection photo={currentPhoto} />

          <SettingsSection transparent={true} gap={1} divider={false} title="Metadata" icon={<FileText />}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'center', width: '100%', p: 1 }}>
              <AlbumsMetaDetails photos={[currentPhoto]} minWidth={25} />
            </Box>
            <DescribePhoto photoId={currentPhoto.id} />
          </SettingsSection>


          <EXIFSection photo={currentPhoto} />


        </Box>}
      </Box>
    </>
  );
}
