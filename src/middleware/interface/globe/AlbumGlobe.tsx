import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import useRelevantAlbumsByProximity from '@/hooks/useRelevantAlbumsByProximity';
import { GalleryPhoto } from '@/lib/galleryData';
import AlbumMapPanelByBatches from '@/middleware/interface/globe/AlbumMapPanelByBatches';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import AlbumMapPreview from './AlbumMapPreview';

export default function AlbumGlobe({ photos, multiplier = 1 }: { photos: GalleryPhoto[], multiplier: number }) {
  const { setPreviewPhotoObj } = useSettings()
  const previewPhotoId = useSettingsStoreSelector((state) => state.previewPhotoObj?.id)
  const mapShowPreview = useSettingsStoreSelector((state) => state.mapShowPreview);
  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);

  const [viewport, setViewport] = useState({
    north: -90,
    south: 90,
    east: 180,
    west: -180,
    zoom: 0,
  });

  useEffect(() => {
    localStorage.setItem('albumGlobeViewport', JSON.stringify(viewport));
  }, [viewport]);

  const batches = useRelevantAlbumsByProximity(photos, viewport, multiplier);

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {photos && <AlbumMapPanelByBatches
          viewport={viewport}
          setViewport={setViewport}
          allPhotos={photos}
          batches={batches}
          onPreview={(photo: GalleryPhoto) => {
            setPreviewPhotoObj(photo)
          }}
        />}

        {!mapShowPreview && (
          <AlbumMapPreview
            batches={batches}
            previewPhotoId={previewPhotoId}
            width={width}
            height={height}
            onPreview={(photo: GalleryPhoto) => {
              setPreviewPhotoObj(photo);
            }}
          />
        )}
      </Box>
    </>
  );
}
