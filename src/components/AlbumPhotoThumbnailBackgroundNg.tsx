import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';
import React from 'react';

type Props = {
  photo: GalleryPhoto;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  original?: boolean;
};

export default function AlbumPhotoThumbnailBackgroundNg({
  photo,
  width,
  height,
  style,
  className,
  original = false,
}: Props) {
  const thumbnailFormat = useSettingsStoreSelector(s => s.thumbnailFormat);
  const { setSetting } = useSettings()
  const { setPreviewPhotoObj } = useSettings();

  const src = composeUrl(photo, original);

  return (
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onDoubleClick={() => {
        setSetting(prev => ({ ...prev, lightboxOpen: true }));
        setPreviewPhotoObj(photo);
      }}
      onClick={() => {
        setPreviewPhotoObj(photo);
      }}
      draggable={false}
      className={className}
      style={{
        width: '100%',
        height,
        display: 'block',
        objectFit: thumbnailFormat === 'cover' ? 'cover' : 'contain',
        objectPosition: 'center',
        ...style,
      }}
    />
  );
}
